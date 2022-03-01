import React, { useState, useEffect, useContext } from 'react';
import { FiUserPlus } from "react-icons/fi";
import { FiUserX } from "react-icons/fi";
import { useParams, useNavigate } from 'react-router-dom';
import Identicon from 'identicon.js';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { TransactionContext } from '../context/TransactionContext';

export const UserProfile = () => {
    const { checkIfWalletIsConnected, currentAccount, fetchAuthorPosts, fetchUserInfo, subscribeUser, unsubscribeUser } = useContext(TransactionContext);
    const [pins, setPins] = useState(null);
    const [followerNum, setFollowerNum] = useState(0);
    const [subscribeNum, setSubscribeNum] = useState(0);
    const [beenSubscribe, setBeenSubscribe] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { userAddress } = useParams(); 

    // Fetching User's Posts
    const fetch = async (userAddress) => {
        const lowerUserAddress = userAddress.toLowerCase();
        const posts = await fetchAuthorPosts(lowerUserAddress);
        setPins(posts);
    }

    // Fetching User's followers and subscribers
    const fetchUser = async (userAddress) => {
        const lowerUserAddress = userAddress.toLowerCase();
        const userInfo = await fetchUserInfo(lowerUserAddress);
        setFollowerNum(userInfo[0].followers.length);
        setSubscribeNum(userInfo[0].subscribes.length);

        const followers = userInfo[0].followers;
        const account = await checkIfWalletIsConnected();
        for(let i = 0; i < followers.length; i++){
            if(followers[i].address.toLowerCase() == account){
                setBeenSubscribe(true);
                break;
            }
            else { setBeenSubscribe(false);}
        }
    }

    const handleSubscribe = async (e) => {
        e.preventDefault();
        const lowerUserAddress = userAddress.toLowerCase();
        const lowerCurrentAccount = currentAccount.toLowerCase();
        setLoading(true);
        await subscribeUser(lowerUserAddress, lowerCurrentAccount);
        setLoading(false);
        fetchUser(userAddress);
    }

    const handleUnsubscribe = async (e) => {
        e.preventDefault();
        const lowerUserAddress = userAddress.toLowerCase();
        const lowerCurrentAccount = currentAccount.toLowerCase();
        setLoading(true);
        await unsubscribeUser(lowerUserAddress, lowerCurrentAccount);
        setLoading(false);
        setBeenSubscribe(false);
        fetchUser(userAddress);
    }

    useEffect(() => {
        fetch(userAddress);
        fetchUser(userAddress);

    }, [userAddress]);

    if(!pins) return <Spinner message="Loading Profile" />
    if(loading) return <Spinner message="Loading" />

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
                        <div className="flex justify-between bg-gray p-4 rounded-lg shadow-lg">
                            <div className="flex flex-col text-center m-2">
                                <span className="font-bold text-xl">{followerNum}</span>
                                <span className="text-base text-blue-600">Followers</span>
                            </div>
                            <div className="flex flex-col text-center m-2">
                                <span className="font-bold text-xl">{subscribeNum}</span>
                                <span className="text-base text-blue-600">Subscribes</span>
                            </div>
                        </div>
                        
                        <div>
                            {(currentAccount !== userAddress.toLowerCase()) && (
                                (beenSubscribe) ? (
                                    <button
                                        type="button"
                                        className="flex bg-red-500 text-white font-bold mt-3 p-2 rounded-full w-36 outline-none item-center justify-center"
                                        onClick={handleUnsubscribe}
                                    >
                                        <FiUserPlus className="m-1 w-5 h-5 opacity-50" />
                                        Unsubscribe
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="flex bg-blue-500 text-white font-bold mt-3 p-2 rounded-full w-36 outline-none item-center justify-center"
                                        onClick={handleSubscribe}
                                    >
                                        <FiUserPlus className="m-1 w-5 h-5 opacity-50" />
                                        Subscribe
                                    </button>
                                )
                                
                            )}
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
