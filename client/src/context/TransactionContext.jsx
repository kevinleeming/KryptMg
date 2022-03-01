import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { sdbClient } from '../utils/client';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

// Declare IPFS
// const ipfsClient = require('ipfs-http-client');
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }); // leaving out the arguments will default to these values
import { create, urlSource } from 'ipfs-http-client';
import { user } from '../../../sdb/schemas/user';
const client = create('https://ipfs.infura.io:5001/api/v0');

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: ""});
    const [postData, setPostData] = useState({title:"", about:"", category:""});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [createPinLoading, setCreatePinLoading] = useState(false);
    const [pinDetailLoading, setPinDetailLoading] = useState(false);

    const [allPost, setAllPost] = useState([]);
    const [postExist, setPostExist] = useState(false);
    //const [profilePost, setProfilePost] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const handlePostChange = (e, name) => {
        setPostData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
              setCurrentAccount(accounts[0]);
              setUserAccountInSDB(accounts[0]);
              return accounts[0];
            } 
            else {
              console.log("No accounts found");
              return "";
            }
        } catch (error) {
            console.log(error);
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask.");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
            setUserAccountInSDB(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    const setUserAccountInSDB = async (userAccount = currentAccount) => {
        try {
            const userDoc = {
                _id: userAccount,
                _type: 'user',
                name: localStorage.getItem("name"),
                followers: [],
                subscribes: [],
                postNum: 0
            }

            await sdbClient.createIfNotExists(userDoc);
        } catch(error) {
            console.log(error);
            throw new Error("Add user to DB fail.");
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask.");

            // get the data from the Form.
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parseAmount = ethers.utils.parseEther(amount); // etherString to BigNumber (Wei) 

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI = 0.000021 Ether
                    value: parseAmount._hex, // transform amount(dec) into hex , (value store Wei)
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parseAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
        } catch(error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    // Uploading posts : 1. upload img/vid on ipfs 2. add metadata on blockchain
    const uploadPost = async (isImage, file, user) => {
        const { title, about, category } = postData;
        const { name, email, profilePic } = user;
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            // 1. upload img/vid on ipfs
            const addedFile = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`;
            console.log(`Uploading to ipfs at ${url}`);

            // 2. create post doc on sanity db
            const postDoc = {
                _id: currentAccount + title + category,
                _type: 'post',
                thumbsup: 0,
                author: currentAccount
            };
            await sdbClient.createIfNotExists(postDoc);

            // 3. add metadata on blockchain
            const transactionContract = getEthereumContract();
            const NewPost = await transactionContract.createPost(url, title, about, category, isImage, name, email, profilePic);
            setCreatePinLoading(true);
            console.log("Loading...");
            await NewPost.wait();
            setCreatePinLoading(false);
            console.log("Add post to blockchain successfully!");

        } catch(error) {
            console.log(error);
            throw new Error("Cannot upload content.", error);
        }
    }

    // Fetching all the posts from blockchain depends on different category.
    const fetchPost = async (categoryName) => {
        try {
            while(allPost.length > 0) allPost.pop();
            setAllPost(allPost);
            setPostExist(false);
            const transactionContract = getEthereumContract();
            const postCount = await transactionContract.postCount();
            for(var i = 1; i <= postCount; i++){
                const p = await transactionContract.post(i);
                if(categoryName == 'all'){
                    allPost.push(p);
                    setAllPost(allPost);
                    setPostExist(true);
                }
                else {
                    if(categoryName == p.category) { 
                        allPost.push(p);
                        setAllPost(allPost);
                        setPostExist(true);
                    }
                }
            }
        } catch(error) {
            console.log(error);
            throw new Error("Fetching post error.");
        }
    }

    // Fetching specific post information
    const fetchOnePost = async (postId) => {
        try {
            const transactionContract = getEthereumContract();
            const post = await transactionContract.post(postId);
            return post;
        } catch(error) {
            console.log(error);
            throw new Error(`Fetching ${postId} post error.`);
        }
    }

    // Tips author
    const tipsAuthor = async (eth, author, postId) => {
        try {
            if(!ethereum) return alert("Please install Metamask.");

            const transactionContract = getEthereumContract();
            const parseAmount = ethers.utils.parseEther(eth);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: author,
                    gas: '0x5208', // 21000 GWEI = 0.000021 Ether
                    value: parseAmount._hex, // transform amount(dec) into hex 
                }]
            })

            const amountEth = ethers.utils.formatEther(parseAmount);
            console.log(amountEth);

            const tipTransaction = await transactionContract.tipPostRecord(author, parseAmount, postId);

            setPinDetailLoading(true);
            console.log(`Tipping ${amountEth} Ethers to author ${author}...`);
            await tipTransaction.wait();
            setPinDetailLoading(false);
            console.log("Successfully tipped.");

        } catch(error) {
            console.log(error);
            throw new Error("Tips Ether Error!");
        }
    }

    const fetchAuthorPosts = async (userAddress) => {
        try {
            let profilePost = [];
            const transactionContract = getEthereumContract();
            const postCount = await transactionContract.postCount();
            for(var i = 1; i <= postCount; i++){
                const post = await transactionContract.post(i);
                if(post.author.toLowerCase() == userAddress){
                    profilePost.push(post);
                    //setProfilePost(profilePost);
                }
            }
            return profilePost;
        } catch(error) {
            console.log(error);
            throw new Error("Fetching Profile Error!");
        }
    }

    const fetchUserInfo = async (account) => {
        try {
            const query  = `*[_type == "user" && _id == '${account}']`;
            const userQuery = await sdbClient.fetch(query);
            return userQuery;
        } catch(error) {
            console.log(error);
            throw new Error("Fetch User Info. Error!");
        }
    }

    const subscribeUser = async (author, subscriber) => {
        try {
            // patch author's followers[]
            await sdbClient.patch(author)
                .setIfMissing({followers: []})
                .append('followers', [{_key: `${subscriber}`, address: `${subscriber}`}])
                .commit();
            // patch subscriber's subscribes[]
            await sdbClient.patch(subscriber)
                .setIfMissing({subscribes: []})
                .append('subscribes', [{_key: `${author}`, address: `${author}`}])
                .commit();
        } catch(error) {
            console.log(error);
            throw new Error("Subscribe Error!");
        }
    }

    const unsubscribeUser = async (author, subscriber) => {
        try {
            // remove from author's followers[]
            const followerToRemove = [`followers[_key=="${subscriber}"]`];
            await sdbClient.patch(author).unset(followerToRemove).commit();
            // remove from subscriber's subscribes[]
            const subscribeToRemove = [`subscribes[_key=="${author}"]`];
            await sdbClient.patch(subscriber).unset(subscribeToRemove).commit();
        } catch(error) {
            console.log(error);
            throw new Error("Unsubscribe Error!");
        }
    }

    // Fetching post's thumbsup number and whether this user already thumbsup or not ?
    const fetchPostThumbs = async (author, title, category) => {
        try {
            const queryId = author.toLowerCase() + title + category;
            const query = `*[_type == "post" && _id == '${queryId}']`;
            const thumbsupQuery = await sdbClient.fetch(query);
            const info = {
                thumbsupNum: thumbsupQuery[0].thumbsup,
                alreadyThumbsup: false
            };
            const account = await checkIfWalletIsConnected();
            for(let i = 0; i < thumbsupQuery[0].thumbsupAccount?.length; i++){
                if(account === thumbsupQuery[0].thumbsupAccount[i].address){
                    info.alreadyThumbsup = true;
                    break;
                }
            }
            return info;
        } catch(error) {
            console.log(error);
            throw new Error("Fetching thumbsup number error !");
        }
    }

    const handleThumbsup = async (author, title, category, account = currentAccount) => {
        try {
            const patchId = author.toLowerCase() + title + category;
            await sdbClient.patch(patchId)
                .setIfMissing({thumbsup: 0})
                .inc({thumbsup: 1})
                .commit();
            await sdbClient.patch(patchId)
                .setIfMissing({thumbsupAccount: []})
                .append('thumbsupAccount', [{_key: `${account}`, address: `${account}`}])
                .commit();
        } catch(error) {
            console.log(error);
            throw new Error("Thumbsup Error!");
        }
    }
    
    const handleUnthumbsup = async (author, title, category, account = currentAccount) => {
        try {
            const patchId = author.toLowerCase() + title + category;
            await sdbClient.patch(patchId)
                .setIfMissing({thumbsup: 0})
                .dec({thumbsup: 1})
                .commit();
            const accountToRemove = [`thumbsupAccount[_key=="${account}"]`];
            await sdbClient.patch(patchId).unset(accountToRemove).commit();
        } catch(error) {
            console.log(error);
            throw new Error("Unthumbsup Error!");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ checkIfWalletIsConnected, connectWallet, currentAccount, isLoading, formData, sendTransaction, handleChange,
         uploadPost, postData, handlePostChange, createPinLoading, // Upload post for './CreatePin.jsx'
         allPost, fetchPost, postExist, // Fetch post for './Feed.jsx'
         fetchOnePost, pinDetailLoading, tipsAuthor, fetchPostThumbs, handleThumbsup, handleUnthumbsup,// Fetch specific post, tip author funct. for './PinDetail.jsx'
         fetchAuthorPosts, fetchUserInfo, subscribeUser, unsubscribeUser // for './UserProfile.jsx'
         }}>
            {children}
        </TransactionContext.Provider>
    )
}