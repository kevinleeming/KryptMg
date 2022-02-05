import React, { useState, useEffect, useContext } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import Identicon from 'identicon.js';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { TransactionContext } from '../context/TransactionContext';

export const UserProfile = () => {
    const { fetchAuthorPosts } = useContext(TransactionContext);
    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);

    const navigate = useNavigate();
    const { userAddress } = useParams(); 

    const fetch = async (userAddress) => {
        const lowerUserAddress = userAddress.toLowerCase();
        const posts = await fetchAuthorPosts(lowerUserAddress);
        setPins(posts);
    }

    useEffect(() => {
        fetch(userAddress);
    }, [userAddress]);

    if(!pins) return <Spinner message="Loading Profile" />

    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">
                    <div className="flex flex-col justify-center items-center">
                        <img
                            className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
                            src="https://source.unsplash.com/1600x900/?nature,photography,technology"
                            alt="banner-pic"
                        />
                        <img
                            className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                            src={`data:image/png;base64,${new Identicon(userAddress.slice(2), 420).toString()}`}
                            alt="user-pic"
                        />
                        <h1 className="text-xl text-center mt-3">
                            {userAddress}
                        </h1>
                        <div className="absolute top-0 z-1 right-0 p-2">
                            {/* Google Logout */}
                        </div>
                    </div>
                    {pins?.length !== 0 ? (
                        <div className="px-2">
                            <MasonryLayout pins={pins} />
                        </div>
                    ) : (
                        <div className="flex justify-center font-bold items-center w-full text-1xl mt-5">
                            No Posts Found !
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default UserProfile;
