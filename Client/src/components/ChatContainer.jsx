import React, { useContext, useEffect,useRef , useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../library/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

function ChatContainer(){

    const {messages,selectedUser,setSelectedUser,sendMessage,getMessages}=useContext(ChatContext);
    const {authUser,onlineUsers}=useContext(AuthContext);

    const [input,setInput] = useState("");
    const scrollEnd=useRef();

    // Handle sending Message
    const handleSendMessage = async(event)=>{
        event.preventDefault();
        if(input.trim() === "") return null;
        await sendMessage({text: input.trim()});
        setInput("");
    }

    // Handle sending Image
    const handleSendImage = async(event)=>{
        const file = event.target.files[0];
        if(!file){
            toast.error("Select an image file");
        }
        const reader = new FileReader();
        reader.onloadend = async ()=>{
            await sendMessage({image: reader.result});
            event.target.value = "";
        }
        reader.readAsDataURL(file);
    }

    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id);
        }
    },[selectedUser])

    useEffect(()=>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({behavior : "smooth"});
        }
    },[messages])

    return selectedUser ? (
    <div className="h-full overflow-y-scroll relative backdrop-blur-lg">
        {/* {HEADER} */}
        <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
            <img onClick={()=>setSelectedUser(null)} src={assets.arrow_icon} alt="arrow-icon" className="cursor-pointer max-w-7"/>
            <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 rounded-full"/>
            <p className="flex-1 text-lg text-black flex items-center gap-2">
                {selectedUser.fullName}
                {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
            </p>
            <img src={assets.help_icon} alt="help-icon" className="max-md:hidden max-w-5 cursor-pointer"/>
        </div>

        {/* {CHATAREA} */}
        <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
            {messages.map((msg,index)=>(
                <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && "flex-row-reverse"}`}>
                    {
                        msg.image ? (
                            <img src={msg.image} alt="" className="max-w-[230px] border border-gray-700 rounded-lg  mb-8"/>                        
                        ) :(
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-[#57564F]/20 text-black ${msg.senderId !== authUser._id ? "rounded-br-none" :"rounded-bl-none"}`}>{msg.text}</p>
                        )
                    }
                    <div className="text-center text-xs"> 
                        <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className="w-7 rounded-full"/>
                        <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
                    </div>
                </div>
            ))}
            <div ref={scrollEnd}></div>
        </div>
        {/* {INPUTAREA} */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
            <div className="flex-1 flex items-center bg-[#7A7A73]/12 px-3 rounded-full">
                <input onChange={(event)=>setInput(event.target.value)} value={input}
                onKeyDown={(event)=>event.key==="Enter" ? handleSendMessage(event) : null}
                type="text" placeholder="Enter your message here"  className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-black placeholder-gray-400"/>
                <input onChange={handleSendImage} type="file" id="image" accept="image/png , image/jpeg" hidden/>
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="gallery-icon" className="w-5 mr-2 cursor-pointer"/>
                </label>
            </div>
            <img onClick={handleSendMessage} src={assets.send_button} alt="sendbutton" className="w-7 cursor-pointer"/>
        </div>
    </div>
    ):(
        <div className="flex flex-col justify-center items-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
            <img  src={assets.logo} alt="big-logo" className="max-w-20"/>
            <p className="text-lg font-medium text-white">Chat Anytime,With Anyone</p>
        </div>
    )
}
 

export default ChatContainer;