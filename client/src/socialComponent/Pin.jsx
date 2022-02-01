import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { SiEthereum } from 'react-icons/si';

import { shortenAddress } from '../utils/shortenAddress';

const Pin = ({ pin: { hash, id, author }, user }) => {
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
                <img src={hash} className="rounded-lg w-full" />
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
                        <div className=" flex justify-between items-center gap-2 w-full">
                            {hash && (
                                <a
                                    href={hash}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {hash.length > 20 ? hash.slice(8, 30) : hash.slice(8)}
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`/user-profile/${user.name}`} className="flex gap-2 mt-2 items-center justify-center">
                <img
                    src={user.profilePic}
                    alt="user-profile"
                    className="w-8 h-8 rounded-full object-cover"
                />
                <p className="font-semibold capitalize">{user.name}</p>
            </Link>
            <div className="flex justify-center">
                <SiEthereum fontSize={20} color="#000" />
                {shortenAddress(author)}
            </div>
        </div>
    )
};

export default Pin;
