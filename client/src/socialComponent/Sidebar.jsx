import React, { useState, useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import { SiEthereum } from 'react-icons/si';
import Google from '../../images/google.png';

import photo from '../../images/photo.png';
import { categories } from '../utils/socialData';
import { shortenAddress } from '../utils/shortenAddress';
import { TransactionContext } from '../context/TransactionContext';

const isNotActiveStyle = 'flex items-center py-2 px-5 gap-3 text-gray-500 hover:text-black hover:scale-105 hover:-translate-y-1 transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center py-2 px-5 gap-3 font-extrabold border-r-2 border-black hover:scale-105 hover:-translate-y-1 transition-all duration-200 ease-in-out capitalize';

export const Sidebar = ({ user, closeToggle }) => {
    const { currentAccount } = useContext(TransactionContext);
    const navigate = useNavigate();

    const Logout = () => {
        localStorage.setItem("name", "");
        localStorage.setItem("email", "");
        localStorage.setItem("profilePic", "");
        navigate('./');
    }

    const handleCloseSidebar = () => {
        // In 'Home.jsx' we call <Sidebar/> twice but with different param (check whether closeToggle exist).
        if(closeToggle) closeToggle(false);
    }

    return (
        <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
            <div className="flex flex-col">
                <Link
                    to='/social'
                    className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
                    onClick={handleCloseSidebar}
                >
                    <img src={photo} className="w-9 h-9"/>
                </Link>

                <div className="flex flex-col gap-5">
                    <NavLink
                        to='/social'
                        className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle)}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeFill />
                        Home
                    </NavLink>
                    <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover cateogries</h3>
                    {categories.map((category) => (
                        <NavLink
                            to={`/category/${category.name}`}
                            className={({isActive}) => (isActive ? isActiveStyle : isNotActiveStyle)}
                            onClick={handleCloseSidebar}
                            key={category.name}
                        >
                            <img src={category.image} className="w-8 h-8 rounded-full shadow-sm" />
                            {category.name}
                        </NavLink>
                    ))}
                </div>
            </div>
            {user && (
                <Link
                    to={`/user-profile/${currentAccount}`}
                    className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
                    onClick={handleCloseSidebar}
                >
                    <div className="flex flex-col">
                        <div className="flex items-center justify-center">
                            <img src={user.profilePic} className="w-10 h-10 rounded-full" alt="user-profile" />
                            <div className="ml-1">{user.name}</div>
                            <div className="ml-1"><IoIosArrowForward /></div>
                        </div>
                        <div className="flex justify-center mt-2">
                            <SiEthereum fontSize={20} color="#000" />
                            {shortenAddress(currentAccount)}
                        </div>
                    </div>
                    
                </Link>
            )}
            {user && (
                <div className="flex item-center justify-center mb-5">
                    <button
                        className="flex bg-red-700/80 hover:bg-red-800/80 text-white font-bold text-base py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={Logout}
                    >
                        <img src={Google} alt="" className="w-5 mr-5" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default Sidebar;
