import React, { useState, useEffect, useContext } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import Spinner from './Spinner';
import { categories } from '../utils/socialData';
import { TransactionContext } from '../context/TransactionContext';

const Input = ({ placeholder, name, type, value, handleChange, isTitle }) => (
    <input
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => handleChange(e, name)}
        className={isTitle ? "outline-none text-xl sm:text-2xl font-bold border-b-2 border-gray-200 p-2" : "outline-none text-base sm:text-xl border-b-2 border-gray-200 p-2"}
    />
);

const CreatePin = ({ user }) => {
    const { connectWallet, currentAccount, postData, handlePostChange, uploadPost } = useContext(TransactionContext);

    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState(false);
    const [imageAsset, setImageAsset] = useState(null);
    const [wrongImageType, setWrongImageType] = useState(false);
    //const [isImage, setIsImage] = useState(); // need to be implemented in 'TransactionContext.jsx'

    const navigate = useNavigate();

    const captureFile = (e) => {
        const selectedFile = e.target.files[0];
        const fileName = selectedFile.name;
        const reader = new FileReader();

        // Check file name to determine whether is img or video file
        // var imgExt = new Array(".jpg", ".jpeg", ".png", ".bmp", ".gif")
        // var fileExt = fileName.substring(fileName.lastIndexOf('.'))
        // if(imgExt.indexOf(fileExt) < 0) setIsImage(false);
        // else setIsImage(true);

        setImageAsset(URL.createObjectURL(selectedFile));
    }

    const savePin = (e) => {
        const { title, about, category } = postData;
        e.preventDefault();
        if(!title || !about || !category) return;
        uploadPost();
    }

    return (
        <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
            {fields && (
                <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">Please add all fields.</p>
            )}
            <div className=" flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
                <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
                    <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
                        {loading && <Spinner />}
                        {wrongImageType && <p>It&apos;s wrong file type.</p>}
                        {!imageAsset ? (
                            <label>
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="font-bold text-2xl">
                                            <AiOutlineCloudUpload />
                                        </p>
                                        <p className="text-lg">Click to upload</p>
                                    </div>
                                    <p className="mt-32 text-gray-400">Use high-quality JPG, JPEG, PNG, BMP, GIF or MP4, MKV, OGG, WMV</p>
                                    <input
                                        type="file"
                                        name="upload-file"
                                        accept=".jpg, .jpeg, .png, .bmp, .gif, .mp4, .mkv .ogg .wmv"
                                        onChange={captureFile}
                                        className="w-0 h-0"
                                    />
                                </div>
                            </label>
                            ) : ( 
                            <div className="relative h-full">
                                <img
                                    src={imageAsset}
                                    alt="uploaded-file"
                                    className="h-full w-full"
                                />
                                <button
                                    type="button"
                                    className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                                    onClick={() => setImageAsset(null)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
                    <Input placeholder='Add your title here' name="title" type="text" handleChange={handlePostChange} isTitle={true}/>
                    {user && (
                        <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
                            <img
                                src={user.profilePic}
                                className="w-10 h-10 rounded-full"
                                alt="user-profile"
                            />
                            <p className="font-bold">{user.name}</p>
                        </div>
                    )}
                    <Input placeholder='Description' name="about" type="text" handleChange={handlePostChange} isTitle={false}/>
                    {(!currentAccount) && (
                        <button
                            type="button"
                            onClick={connectWallet}
                            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                        >
                            <p className="text-white text-base font-semibold">Connect Wallet</p>
                        </button>
                    )}
                    <div className="flex flex-col">
                        <div>
                            <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Category</p>
                            <select
                                onChange={(e) => handlePostChange(e, "category")}
                                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                            >
                                <option key="others" value="others" className="sm:text-bg bg-white">Select Category</option>
                                {categories.map((category) => (
                                    <option className="text-base border-0 outline-none capitalize bg-white text-black " key={category.name} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end items-end mt-5">
                            <button
                                type="button"
                                onClick={savePin}
                                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                            >
                                Save Pin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePin
