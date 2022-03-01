import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { TransactionContext } from '../context/TransactionContext';
import logo from '../../images/logo.png';

export const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const { currentAccount } = useContext(TransactionContext);

    const navigate = useNavigate(); 

    return (
        <div className="flex justify-between gap-2 md:gap-5 w-full mt-5 pb-7 ">
            <div className="flex justify-center w-full items-center px-2 bg-gray-200 rounded-full border-none outline-none">
                {/* <IoMdSearch fontSize={21} className="ml-1" />
                <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Search'
                    value={searchTerm}
                    onFocus={() => navigate('/search')}
                    className="p-2 w-full bg-white outline-none"
                /> */}
                <img src={logo} alt="logo" className="w-32 cursor-pointer" />
            </div>
            <div className="flex gap-3">
                <Link to={`/user-profile/${currentAccount}`} className="hidden md:block">
                    <img src={user.profilePic} alt="" className="w-10 h-10 rounded-full"/>
                </Link>
                <Link to="/create-pin" className="bg-stone-600/60 hover:bg-stone-600/80 text-white rounded-2xl w-24 h-9 md:w-40 md:h-10 flex justify-center items-center">
                    <IoMdAdd />
                    <p className="font-bold ml-1">Add Content</p>
                </Link>
            </div>
            
        </div>
    )
}

export default Navbar;
