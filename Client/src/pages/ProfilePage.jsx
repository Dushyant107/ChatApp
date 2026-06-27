import React, { useState , useContext } from 'react';
import {useNavigate} from "react-router-dom";
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';


function ProfilePage(){

    const navigate = useNavigate();
    const { authUser,updateProfile } = useContext(AuthContext);


    const [selectedImg,setSelectedImg]= useState(null);
    const [name,setName]= useState(authUser.fullName);
    const [bio,setBio] = useState(authUser.bio);



    async function handleSubmit(event){
        event.preventDefault();

        if(!selectedImg){
            await updateProfile({fullName : name , bio});
            navigate("/");
            return;
        } 

        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onload = async ()=>{
            const base64Image = reader.result;
            await updateProfile({profilePic : base64Image , fullName : name , bio});
            navigate("/");
            return; 
        }
    }

    return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
        <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-black border-2 border-gray-600 
        flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
                <h3 className='text-lg border border-black-50 flex justify-center shadow shadow-gray-600 '>Profile details</h3>
                <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
                    <input onChange={(event)=>{setSelectedImg(event.target.files[0])}} type="file" id='avatar' accept=' .png, .jpg, .jpeg' hidden />
                    <img src={ selectedImg? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt='' className={`w-12 h-12 ${selectedImg && `rounded-full`}`}/>
                    upload profile image
                </label>
                <input 
                onChange={(event)=>setName(event.target.value)} value={name}
                type='text'
                placeholder='Your name' required 
                className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500'/>
                <textarea 
                onChange={(event)=>setBio(event.target.value)} value={bio}
                placeholder='write your bio' required rows={4}
                className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500'>
                </textarea>
                <button type='submit' 
                className="py-3 bg-gradient-to-r from-[#57564F] to-[#DDDAD0] text-black rounded-md cursor-pointer "
                >Save Changes</button>
            </form>

            <img className={`max-w-42 mx-10 max-sm:mt-10 ${selectedImg && "rounded-full"}`} src={ authUser?.profilePic || assets.logo}/>
        </div>
    </div>);
}

export default ProfilePage