import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { SiEthereum } from 'react-icons/si';
import { FiThumbsUp } from "react-icons/fi";

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { TransactionContext } from '../context/TransactionContext';
import { shortenAddress } from '../utils/shortenAddress';

const PinDetail = ({ user }) => {
    const { fetchOnePost, pinDetailLoading, tipsAuthor } = useContext(TransactionContext);
    //const [pins, setPins] = useState(null); 
    const [pinDetail, setPinDetail] = useState(null);
    //const [comment, setComment] = useState('');
    //const [addingComment, setAddingComment] = useState(false); 
    const [eth, setEth] = useState("");
    const { pinId } = useParams();

    const fetch = async (pinId) => {
        const post = await fetchOnePost(pinId);
        setPinDetail(post);
    }

    const handleChange = (e) => {
        setEth(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const author = pinDetail.author;
        const postId = Number(pinDetail.id._hex);
        if(!author || eth <= 0 || postId === 0) return;
        tipsAuthor(eth, author, postId);
    }

    useEffect(() => {
        fetch(pinId);
    }, [pinId])

    if(!pinDetail) return <Spinner message="Loading pin" />
    if(pinDetailLoading) return <Spinner message="Tipping Author" />

    return (
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
            <div className="relative flex justify-center items-center md:items-start flex-initial">
                <img
                    src={pinDetail.hash}
                    className="rounded-t-3xl rounded-b-lg"
                    alt="user-post"
                />
                <div className="absolute bottom-0 right-0 flex p-4">
                    <div className="flex flex-row">
                        <FiThumbsUp className="w-10 h-10 bg-white opacity-60 rounded-lg" />
                        <p className="ml-2 p-1 text-white text-2xl opacity-70">{ethers.utils.formatEther(pinDetail.tipAmount)} ethers</p>
                    </div>
                </div>
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <a
                            href={pinDetail.hash}
                            download
                            onClick={(e) => {e.stopPropagation();}}
                            className="bg-white w-12 h-12 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                        >
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    <p className="text-base font-bold">IPFS Address:</p>
                    <a href={pinDetail.hash} target="_blank" rel="noreferrer" className="bg-stone-300 flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md">
                        {pinDetail.hash.slice(8, 70)}
                    </a>
                </div>
                <div>
                    <h1 className="text-4xl font-bold break-words mt-3">
                        {pinDetail.title}
                    </h1>
                    <div className="bg-stone-200/50 flex text-black p-2 rounded-lg opacity-70">
                        <p className="mt-3">{pinDetail.description}</p>
                    </div>
                </div>
                <Link to={`/user-profile/${pinDetail.authorGmailName}`} className="flex gap-2 mt-2 items-center">
                    <p className="font-semibold capitalize">Author:</p>
                    <img
                        src={pinDetail.authorPic}
                        alt="user-profile"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <p className="font-semibold capitalize">{pinDetail.authorGmailName}</p>
                </Link>
                <div className="flex justify-start mt-2">
                    <p className="font-semibold capitalize">Address:</p>
                    <SiEthereum fontSize={20} color="#000" />
                    {shortenAddress(pinDetail.author)}
                </div>
                
                <h2 className="mt-10 text-xl font-bold">Tips Author</h2>
                <input 
                    placeholder="Amount (ETH)"
                    type="number"
                    step="0.0001"
                    value={eth}
                    onChange={handleChange}
                    className="my-2 rounded-sm p-2 border-[1px] border-gray-400 bg-gray text-sm focus:outline-none"
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="ml-3 border-[1px] p-2 border-[#c2d0f2] hover:bg-[#c2d0f2] rounded-lg cursor-pointer"
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default PinDetail
