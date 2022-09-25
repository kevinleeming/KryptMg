import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import emailjs from '@emailjs/browser';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { SiEthereum } from 'react-icons/si';
import { AiOutlineHeart } from "react-icons/ai";
import { GrMoney } from 'react-icons/gr';

import Spinner from './Spinner';
import { TransactionContext } from '../context/TransactionContext';
import { shortenAddress } from '../utils/shortenAddress';
import Modal from './Modal';

const PinDetail = ({ user }) => {
    const { fetchOnePost, pinDetailLoading, tipsAuthor, fetchPostThumbs, handleThumbsup, handleUnthumbsup, AdLogoUpload } = useContext(TransactionContext);
    const [pinDetail, setPinDetail] = useState(null);
    const [eth, setEth] = useState("");
    const [thumbsupNum, setThumbsupNum] = useState(0);
    const [haveBeenThumbsup, setHaveBeenThumbsup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [adUrl, setAdUrl] = useState("");
    const { pinId } = useParams();

    const fetch = async (pinId) => {
        const post = await fetchOnePost(pinId);
        setPinDetail(post);
        fetchThumbsup(post.author, post.title, post.category);
    }

    const fetchThumbsup = async (author, title, category) => {
        const thumbsupObj = await fetchPostThumbs(author, title, category);
        setThumbsupNum(thumbsupObj.thumbsupNum);
        setHaveBeenThumbsup(thumbsupObj.alreadyThumbsup);
    }

    const handleChange = (e) => {
        setEth(e.target.value);
    }

    const handleUrlChange = (e) => {
        setAdUrl(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const author = pinDetail.author;
        const postId = Number(pinDetail.id._hex);
        if(!author || eth <= 0 || postId === 0) return;
        setIsOpen(false);
        tipsAuthor(eth, author, postId);

        var template = {
            from_name: user.name,
            to_name: pinDetail.authorGmailName,
            from_email: user.email,
            to_email: pinDetail.authorEmail,
            message: `${user.name} likes your post, and he/she tips you ${eth}(ETH) for this awesome post.`,
        };
        emailjs.send('service_vsi7aii', 'template_vr4p7r9', template, 'user_7RP87uXEdrT2YSmwJmgdZ')
        .then(response => {
            console.log('Mailing SUCCESS!', response.status, response.text);
        }, error => {
            console.log('Mailing FAILED...', error);
        });
    }

    const handleThumbsupEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        await handleThumbsup(pinDetail.author, pinDetail.title, pinDetail.category);
        fetchThumbsup(pinDetail.author, pinDetail.title, pinDetail.category);
        setLoading(false);
    }

    const handleUnthumbsupEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        await handleUnthumbsup(pinDetail.author, pinDetail.title, pinDetail.category);
        fetchThumbsup(pinDetail.author, pinDetail.title, pinDetail.category);
        setLoading(false);
    }

    useEffect(() => {
        fetch(pinId);
    }, [pinId])

    if(!pinDetail) return <Spinner message="Loading pin" />
    if(pinDetailLoading) return <Spinner message="Tipping Author" />
    if(loading) return <Spinner message="Loading" />

    return (
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
            <div className="relative flex justify-center items-center md:items-start flex-initial">
                {pinDetail.isImage ?
                    <img
                        src={pinDetail.hash}
                        className="rounded-t-3xl rounded-b-lg"
                        alt="user-post"
                    /> :
                    <video src={pinDetail.hash} controls autoPlay className="rounded-t-3xl rounded-b-lg" />
                }
                <div className="absolute bottom-0 left-0 flex flex-row p-4">
                    <div className="bg-red-100/50 rounded-lg ml-2 item-center justify-center flex flex-row">
                        {haveBeenThumbsup ? (
                            <button
                                type="button"
                                onClick={handleUnthumbsupEvent}
                            >
                                <div className="bg-red-500/80 rounded-full p-1 item-center justify-center">
                                    <AiOutlineHeart className="w-12 h-12 opacity-80" />
                                </div>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleThumbsupEvent}
                            >
                                <div className="bg-transparent rounded-full p-1 item-center justify-center">
                                    <AiOutlineHeart className="w-12 h-12 opacity-80" />
                                </div>
                            </button>
                        )}
                        <p className="m-2 p-1 text-black text-2xl opacity-70">{thumbsupNum}</p>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 p-4">
                    <div className="bg-gray-100/50 rounded-lg ml-1 flex flex-row item-center justify-center">
                        <GrMoney className="m-2 w-8 h-8"/>
                        <p className="ml-1 p-1 text-black text-2xl opacity-70">{ethers.utils.formatEther(pinDetail.tipAmount)} ethers</p>
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
                    <a href={pinDetail.hash} target="_blank" rel="noreferrer" className="sm:hidden bg-stone-300 flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md">
                        {pinDetail.hash.slice(8, 40)}...
                    </a>
                    <a href={pinDetail.hash} target="_blank" rel="noreferrer" className="hidden sm:flex bg-stone-300 items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md">
                        {pinDetail.hash.slice(8, 60)}...
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
                <div className="flex gap-2 mt-2 items-center">
                    <p className="font-semibold capitalize">Author:</p>
                    <img
                        src={pinDetail.authorPic}
                        alt="user-profile"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <p className="font-semibold capitalize">{pinDetail.authorGmailName}</p>
                </div>
                <Link to={`/user-profile/${pinDetail.author}`} >
                    <div className="flex justify-start mt-2">
                        <p className="font-semibold capitalize">Address:</p>
                        <SiEthereum fontSize={20} color="#000" />
                        {shortenAddress(pinDetail.author)}
                    </div>
                </Link>
                
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="m-3 border-[2px] p-2 border-[#c2d0f2] hover:bg-[#c2d0f2] rounded-xl cursor-pointer"
                >
                    <p className="text-lg subpixel-antialiased font-sans">Donate Author</p>
                </button>
                <Modal open={isOpen} onClose={() => setIsOpen(false)} normalDonate={handleSubmit} handleChange={handleChange} eth={eth} handleUrlChange={handleUrlChange} adUrl={adUrl} setIsOpen={setIsOpen} AdLogoUpload={AdLogoUpload} />
            </div>
        </div>
    )
}

export default PinDetail
