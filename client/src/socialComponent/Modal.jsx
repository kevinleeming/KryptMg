import React, { useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { FaUser } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { sdbClient } from '../utils/client';

const Modal = ({open, onClose, normalDonate, handleChange, eth, handleUrlChange, adUrl, setIsOpen, AdLogoUpload}) => {
  const [imageAsset, setImageAsset] = useState(null);
  const [adDonation, setAdDonation] = useState("");
  const [Document, setDocument] = useState(null);

  const handleDonation = (e) => {
      setAdDonation(e.target.value);
  }

  const captureFile = (e) => {
    const selectedFile = e.target.files[0];
    setImageAsset(URL.createObjectURL(selectedFile));
    sdbClient.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
            setDocument(document);
        })
        .catch((error) => {
            console.log('Upload to sanity failed.', error.message);
        });
  }

  const UploadAdInfo = (e) => {
    const deployNum = adDonation / 0.0001;
    //console.log(Document?._id);
    //AdLogoUpload(Document, adUrl, deployNum, setIsOpen);
    const doc = {
        _type: 'advertise',
        adLogo: {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: Document?._id
            },
        },
        adUrl,
        deployNum 
    };
    sdbClient.create(doc)
        .then(() => {
            setIsOpen(false);
        })
  }

  if(!open) return null

  return (
    <>
        <div className="fixed inset-0 bg-black opacity-80" onClick={onClose}/>
        <div className="fixed top-1/2 left-2/4 -translate-x-2/4 -translate-y-1/2 bg-slate-300 w-1/2 h-fit p-4 rounded-lg gradient-bg-donation">
            <div>
                <button onClick={onClose}>
                    <AiFillCloseCircle className="w-8 h-8 opacity-80" />
                </button>
            </div>
            <div className="flex item-center mt-2">
                <FaUser className="w-8 h-8 m-2" />
                <p className="ml-1 text-lg subpixel-antialiased font-sans text-slate-900/80">
                    If you are a normal user, and you want to donate this author for this post.
                </p>
            </div>

            <div className="flex flex-row justify-center">
                <input 
                    placeholder="Amount (ETH)"
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    value={eth}
                    onChange={handleChange}
                    className="my-2 p-2 border-[2px] border-[#5261b3] rounded-xl bg-transparent text-base focus:outline-none"
                />
                <button className="flex m-2 border-[2px] p-2 border-[#5261b3] hover:bg-[#b49fc2] opacity-70 rounded-xl cursor-pointer" onClick={normalDonate}>
                    <p className="subpixel-antialiased font-sans font-bold">
                        Normal Donation
                    </p>
                </button>
            </div>

            <div className="flex item-center mt-2">
                <FaUserTie className="w-8 h-8 m-2" />
                <p className="text-lg subpixel-antialiased font-sans text-slate-900/80">
                    Advertisement merchant can deploy their ads here. Enter advertisement detail...
                </p>
            </div>

            <div className="flex flex-col item-center">
                <p className=" mt-2 text-base subpixel-antialiased font-sans text-slate-800/80">
                    1. Advertisement URL :
                </p>
                <input 
                    placeholder="Ad URL"
                    type="text"
                    value={adUrl}
                    onChange={handleUrlChange}
                    className="my-2 p-2 border-[2px] border-[#5261b3] rounded-xl bg-transparent text-base focus:outline-none"
                />
                <p className="mt-2 text-base subpixel-antialiased font-sans text-slate-800/80">
                    2. Advertisement Logo :
                </p>
                {(!imageAsset) ?
                    <label>
                        <div className="flex flex-col mt-8 py-4 items-center justify-center bg-slate-300/30">
                            <div className="flex flex-col justify-center items-center">
                                <p className="font-bold text-2xl">
                                    <AiOutlineCloudUpload />
                                </p>
                                <p className="text-lg">Click to upload</p>
                            </div>
                            <p className="mt-16">Use high-quality JPG, JPEG, PNG, BMP, GIF</p>
                            <input
                                type="file"
                                name="upload-file"
                                accept=".jpg, .jpeg, .png, .bmp, .gif"
                                onChange={captureFile}
                                className="w-0 h-0"
                            />
                        </div>
                    </label> :
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
                }
                <p className=" mt-2 text-base subpixel-antialiased font-sans text-slate-800/80">
                    3. Donation :
                </p>
                <input 
                    placeholder="Amount (ETH)"
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    value={adDonation}
                    onChange={handleDonation}
                    className="my-2 p-2 border-[2px] border-[#5261b3] rounded-xl bg-transparent text-base focus:outline-none"
                />
                <div className="flex justify-center items-end mt-8">
                    <button
                        type="button"
                        onClick={UploadAdInfo}
                        className="p-2 w-28 border-[2px] border-[#5261b3] hover:bg-[#b49fc2] opacity-70 rounded-xl cursor-pointer font-bold"
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    </>
    
  )
}

export default Modal