import React, { useState, useEffect, useRef, useContext } from 'react'
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Routes, Route } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';

import { Sidebar, UserProfile, Pins } from '../socialComponent';

const Home = () => {
    const { currentAccount } = useContext(TransactionContext);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [user, setUser] = useState({name: localStorage.getItem("name") , email: localStorage.getItem("email") , profilePic: localStorage.getItem("profilePic")});
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current.scrollTo(0, 0);
    }, [])

    return (
        <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
            <div className="hidden md:flex h-screen flex-initial"> {/* Desktop: only show Sidebar */}
                <Sidebar user={user}/>
            </div>
            <div className="flex md:hidden flex-row"> {/* Mobile: */}
                <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
                    <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
                    <Link to={`user-profile/${currentAccount}`}>
                        <img src={user?.profilePic} alt="" className="w-10 h-10 rounded-full" />
                    </Link>
                </div>
                {toggleSidebar && ( // Sidebar part of Mobile
                    <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
                        <div className="absolute w-full flex justify-end items-center p-2">
                            <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
                        </div>
                        <Sidebar user={user} closeToggle={setToggleSidebar}/>
                    </div>
                )}
            </div>
            <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
                <Routes>
                    <Route path='/user-profile/:userAddress' element={<UserProfile />} />
                    <Route path='/*' element={<Pins user={user}/>} />
                </Routes>
            </div>
        </div>
    )
}

export default Home;
