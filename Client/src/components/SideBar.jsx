import React,{useContext, useEffect, useState} from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

export const SideBar = () =>{

    const {logOut ,onlineUsers} = useContext(AuthContext);
    const {getUsers,users,selectedUser,setSelectedUser,unseenMessages,setUnseenMessages} = useContext(ChatContext);

    const navigate = useNavigate();
    const [input,setInput] = useState("");

    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(()=>{
        getUsers();
    },[])

    return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-x1 overflow-x-scroll text-black ${selectedUser? 'max-md:hidden' :''}`}>
        <div className="pb-5">
            <div className="flex justify-between items-center">
                <div className="flex justify-center items-center gap-4">
                    <img src={assets.logo} alt="logo" className="max-w-8"/>
                    <p className="text-black ">Chatters</p>
                </div>
                <div className="relative py-2 group">
                    <img src={assets.menu_icon} alt="Menu" className="max-h-5 cursor-pointer" />
                    <div className="absolute top-full right-0 z-20 w-30 p-3 rounded-md bg-[#DDDAD0] border border-gray-600 text-black  hidden group-hover:block">
                        <p onClick={()=>navigate(`/profile`)} className="cursor-pointer text-sm">Edit Profile</p>
                        <hr className="my-2 border-t border-gray-500"/>
                        <p onClick={()=>logOut()} className="cursor-pointer text-sm">Logout</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#F8F3CE] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
                <img src={assets.search_icon} alt="search-icon" className="w-5"/>
                <input onChange={(event)=>setInput(event.target.value)} type="text" className="bg-transparent border-none outline-none text-black text-xs placeholder-[#c8c8c8] flex-1" placeholder="Search User..."/>
            </div>
        </div>

        <div className="flex flex-col">
            {filteredUsers.map((user,index)=>(

               <div onClick={()=>{setSelectedUser(user),setUnseenMessages((prev)=>({...prev,[user._id]:0}))}} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm 
               ${selectedUser?._id===user._id && 'bg-[#57564F]/20' }`}>
                <img src={user?.profilePic || assets.avatar_icon} alt="avatar" className="w-[35px] aspect-[1/1] rounded-full"  />
                <div className="flex flex-col leading-5">
                    <p>{user.fullName}</p>
                    {
                        onlineUsers.includes(user._id)
                        ? <span className="text-green-600 text-xs">online</span> 
                        : <span className="text-neutral-400 text-xs">offline</span>
                    }
                </div>
                { unseenMessages[user._id] > 0 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-purple-400]">{unseenMessages[user._id]}</p>}
               </div>
               )
            )}
        </div>
    </div>);
}


export default SideBar;