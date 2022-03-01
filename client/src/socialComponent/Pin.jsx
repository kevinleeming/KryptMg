import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { SiEthereum } from 'react-icons/si';
import { FiThumbsUp } from "react-icons/fi";

import { shortenAddress } from '../utils/shortenAddress';

const Pin = ({ pin: { isImage, hash, id, author, category, tipAmount, authorGmailName, authorPic }, user }) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="m-2">
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${id}`)}
                className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
            >
                {isImage ? 
                    <img src={hash} className="rounded-lg w-full" /> :
                    <video src={hash} controls autoPlay muted className="rounded-lg w-full" />
                }
                
                {postHovered && (
                    <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50" style={{ height: '100%' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <a
                                    href={hash}
                                    download
                                    onClick={(e) => {e.stopPropagation();}}
                                    className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 flex p-2">
                            <div className="flex flex-row">
                                <FiThumbsUp className="w-7 h-7 bg-white opacity-80 rounded-lg" />
                                <div className="flex bg-white items-center ml-1 rounded-lg opacity-50">
                                    <p className="p-1 text-dark text-base font-bold">{ethers.utils.formatEther(tipAmount)} ethers</p>
                                </div>
                            </div>
                        </div>
                        <div className=" flex justify-between items-center gap-2 w-full">
                            {hash && (
                                <a
                                    href={hash}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {hash.slice(8, 30)}...
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <h4 className="flex text-zinc-500 font-semibold text-lg text-gray-800 item-center justify-center">{category}</h4>
            <Link to={`/user-profile/${author}`} className="flex flex-col gap-2 mt-1 items-center justify-center">
                <div className="flex">
                    <img
                        src={authorPic}
                        alt="user-profile"
                        className="w-7 h-7 rounded-full object-cover"
                    />
                    <p className="font-semibold ml-1 capitalize">{authorGmailName}</p>
                </div>
                <div className="flex justify-center">
                    <SiEthereum fontSize={20} color="#000" />
                    {shortenAddress(author)}
                </div>
            </Link>
        </div>
    )
};

export default Pin;
