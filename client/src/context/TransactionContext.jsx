import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

// Declare IPFS
// const ipfsClient = require('ipfs-http-client');
// const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }); // leaving out the arguments will default to these values
import { create } from 'ipfs-http-client';
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
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
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

    // Uploading posts : 1. upload on ipfs 2. add metadata on blockchain
    const uploadPost = async (isImage, file, user) => {
        const { title, about, category } = postData;
        const { name, email, profilePic } = user;
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const addedFile = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`;
            console.log(`Uploading to ipfs at ${url}`);
            // const addedFile = await ipfs.add(file, {
            //     progress: (prog) => console.log(`received: ${prog}`),
            // });
            // console.log(addedFile);

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
            // while(profilePost.length > 0) profilePost.pop();
            // setAllPost(profilePost)
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

    const UserCheck = async (account) => {
        const transactionContract = getEthereumContract();
        
        const userExist = await transactionContract.isExistUser(account);
        if(userExist){
            console.log(`${account} exist in Block.`);
        }
        else{
            console.log(`${account} yet exist in Block.`);
            const addUserToBlock = await transactionContract.AddUser(account);
            console.log("Add user to blockchain...");
            await addUserToBlock.wait();
            console.log("Successfully added.");
        }
    }

    const fetchUserInfo = async (account) => {
        const info = {
            followers: [],
            subscribes: [],
        }
        const transactionContract = getEthereumContract();
        const userExist = await transactionContract.isExistUser(account);
        if(userExist){
            console.log(`${account} exist in Block.`);
            info.followers = await transactionContract.getFollowers(account);
            info.subscribes = await transactionContract.getSubscribes(account);
        }
        else console.log(`${account} yet exist in Block.`);
        return info;
    }

    const subscribeUser = async (author, subscriber) => {
        try {
            const transactionContract = getEthereumContract();
            const subscribeEvent = await transactionContract.Subscribe(author, subscriber);
            console.log("Loading...");
            await subscribeEvent.wait();
            console.log("Success.");
        } catch(error) {
            console.log(error);
            throw new Error("Subscribe Error!");
        }
    }

    useEffect(() => {
        const acc = checkIfWalletIsConnected();
        UserCheck(acc);
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, isLoading, formData, sendTransaction, handleChange,
         uploadPost, postData, handlePostChange, createPinLoading, // Upload post for './CreatePin.jsx'
         allPost, fetchPost, postExist, // Fetch post for './Feed.jsx'
         fetchOnePost, pinDetailLoading, tipsAuthor, // Fetch specific post, tip author funct. for './PinDetail.jsx'
         fetchAuthorPosts, fetchUserInfo, subscribeUser // for './UserProfile.jsx'
         }}>
            {children}
        </TransactionContext.Provider>
    )
}