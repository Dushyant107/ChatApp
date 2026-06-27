import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";


const backendUrl= import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL=backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{

    const[token , setToken ] = useState(localStorage.getItem("token"));
    const[authUser , setAuthUser ] = useState(null);
    const[onlineUsers , setOnlineUsers ] = useState([]);
    const[socket , setSocket ] = useState(null);

    // check if user is authenticated if so, set the userdata and socket
    const checkAuth = async ()=>{
        try {
            const {data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Login function to handle user authentification and socket connection
    const login = async(state,credentials)=>{
        try {
            const {data} = await axios.post(`/api/auth/${state}`,credentials);
            if ( data.success ){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token",data.token);
                toast.success(data.message);
            }else{
                toast.error(error.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const googleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const { data } = await axios.post("/api/auth/google", { credential });
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success("Google login successful");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

    // Logout function and socket disconnection
    const logOut = async(state,credentials)=>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logout success")
        socket?.disconnect();
    }

    // Update profile
    const updateProfile = async(body)=>{
        try {
            const {data} = await axios.put("/api/auth/update-profile",body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("profile update successfully")
            }else {
                toast.error(data.message || 'Profile update failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred');
        }
    }


    //  Connect socket function to handle socket connection and online user updates
    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return ;
        const newSocket = io(backendUrl,{
            query:{
                userId: userData._id
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) =>{
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    },[])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logOut,
        updateProfile,
        googleLogin
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}