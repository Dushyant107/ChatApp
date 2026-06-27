import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

function ProfileContainer(){
    
    const {selectedUser,messages} = useContext(ChatContext);
    const {logOut , onlineUsers} = useContext(AuthContext);
    const [msgImages , setMsgImages] = useState([]);

    // Get all images from messages and set them into state

    useEffect(()=>{
        setMsgImages(
            messages.filter(msg => msg.image).map(msg => msg.image)
        )
    },[messages])


    const navigate = useNavigate();
    return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-black w-full relative overflow-y-scrool ${selectedUser ? "max:md:hidden" : ""}`}>
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="user-img"   className={`w-20 aspect-[1/1] rounded-full border-2 ${onlineUsers.includes(selectedUser?._id) ? 'border-green-400' : 'border-gray-300'}`}/>
            <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
                {selectedUser.fullName}
            </h1>
            <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div> 
        <hr className=" border-[#09090950] my-4"/>
        <div className="px-5 text-xs">
            <p>Media</p>
            <div className="mt-2 max-h-[180px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
                {msgImages.map((url,index)=>(
                    <div key={index} onClick={()=> window.open(url)} className="cursor-pointer rounded">
                        <img src={url} alt="img" className="h-full rounded-md"/>
                    </div>
                )
                )}
            </div>
        </div>
        <button 
        onClick={() =>logOut()}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#57564F] to-[#DDDAD0]  text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer">
        Logout
        </button>
    </div>);
}


export default ProfileContainer;