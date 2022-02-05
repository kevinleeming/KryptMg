import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { TransactionContext } from '../context/TransactionContext';


export const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const { currentAccount } = useContext(TransactionContext);

    const navigate = useNavigate(); 

    return (
        <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7 ">
            <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
                <IoMdSearch fontSize={21} className="ml-1" />
                <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Search'
                    value={searchTerm}
                    onFocus={() => navigate('/search')}
                    className="p-2 w-full bg-white outline-none"
                />
            </div>
            <div className="flex gap-3 ">
                <Link to={`/user-profile/${currentAccount}`} className="hidden md:block">
                    <img src={user.profilePic} alt="user-img" className="w-10 h-10 rounded-full"/>
                </Link>
                <Link to="/create-pin" className="bg-black/80 hover:bg-stone-800 text-white rounded-lg w-9 h-9 md:w-10 md:h-10 flex justify-center items-center">
                    <IoMdAdd />
                </Link>
            </div>
        </div>
    )
}

export default Navbar;
