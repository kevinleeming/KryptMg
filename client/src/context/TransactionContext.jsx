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
              //getAllTransactions();
            } 
            else {
              console.log("No accounts found");
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
            const parseAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI = 0.000021 Ether
                    value: parseAmount._hex, // transform amount(dec) into hex 
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
    const uploadPost = async (isImage, file) => {
        const { title, about, category } = postData;
        try {
            const addedFile = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`;
            console.log(`Uploading to ipfs at ${url}`);
            // const addedFile = await ipfs.add(file, {
            //     progress: (prog) => console.log(`received: ${prog}`),
            // });
            // console.log(addedFile);

            const transactionContract = getEthereumContract();
            const NewPost = await transactionContract.createPost(url, title, about, category, isImage);
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

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, isLoading, formData, sendTransaction, handleChange, uploadPost, postData, handlePostChange, createPinLoading }}>
            {children}
        </TransactionContext.Provider>
    )
}