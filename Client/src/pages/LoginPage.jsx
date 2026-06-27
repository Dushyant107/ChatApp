import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from "../../context/AuthContext";


function LoginPage(){
    const [currstate,setCurrState] =useState("Sign up")
    const [fullName,setFullName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [bio,setBio] = useState("")
    const [isDataSubmitted,setIsDataSubmitted]=useState(false)

    const {login , googleLogin} = useContext(AuthContext);

    function onSubmitHandler(event){
       event.preventDefault();
        if(currstate === "Sign up" && !isDataSubmitted){
            setIsDataSubmitted(true);
            return;
        }
        login(currstate === "Sign up" ? 'signup' : 'login' , {fullName,email,password,bio} );
    }
    function handleGoogleLogin(){
        window.open(`${import.meta.env.VITE_BACKEND_URL}/api/users/google`,"_self");
    }   

    return (
            <div className='min-h-screen bg-cover bg-no-repeat  flex items-center justify-center'>
            <div className=" flex items-center justify-around gap-40 sm:justify-evenly max-sm:flex-col backdrop-blur-xs min-h-[500px]">
                <div className="flex flex-col items-center gap-4">
                    <img src={assets.logo} alt='logo' className='w-[min(30vw,220px)]'/>
                    <div onClick={handleGoogleLogin} className='flex items-center gap-7 bg-gradient-to-r from-[#57564F] to-[#DDDAD0] rounded-full p-6'>
                    <p>Login with google</p>
                    <img src={assets.google_icon} alt='google_icon' className='w-10 '/>
                    </div>
                    </div>
                <form  onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-black border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
                    <h2 className="font-medium text-2xl flex justify-between items-center">
                        {currstate}
                        {isDataSubmitted && (<img onClick={()=>{setIsDataSubmitted(false)}} src={assets.arrow_icon} alt="arrow-icon" className='w-5 cursor-pointer'/>)}
                    </h2>
                    {currstate === "Sign up" && !isDataSubmitted &&(
                    <input onChange={(event)=>{setFullName(event.target.value)}} value={fullName}
                    type="text" placeholder='Enter your full Name' className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" required />
                    )}

                    {!isDataSubmitted && (
                        <>
                        <input onChange={(event)=>setEmail(event.target.value)} value={email}
                        type="email" placeholder="Enter email"  className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" required/>
                        <input onChange={(event)=>setPassword(event.target.value)} value={password}
                        type="password" placeholder="Password"  className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" required/>
                        </>
                    )}

                    {currstate==="Sign up" && isDataSubmitted && (
                        <textarea onChange={(event)=>setBio(event.target.value)} value={bio}
                        rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500' placeholder='Bio..' ></textarea>
                    )}

                    {currstate==="Sign up" && (
                        <div className='flex items-center gap-2 text-sm text-black'>
                            <input type='checkbox'/>
                            <p>Agree to terms and conditions</p>
                        </div>
                    )}

                    <button 
                    type='submit' 
                    className="py-3 bg-gradient-to-r from-[#57564F] to-[#DDDAD0] text-black rounded-md cursor-pinter ">
                    {currstate === "Sign up" ? "Create Account" :"Login Now"}
                    </button>
                    
                    <div className='flex flex-col gap-2'>
                        {currstate==="Sign up" ? (
                            <p className='text-sm text-black'>
                                Already have an account? 
                            <span className='font-medium text-[#57564F] cursor-pointer underline'
                                onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}}
                            >Login here</span></p>
                        ) :(
                            <p className='text-sm text-black'>
                            Create an Account 
                            <span className='font-medium text-[#57564F] cursor-pointer underline'
                            onClick={()=>{setCurrState("Sign up"); setIsDataSubmitted(false)}}
                            >Click here</span></p>
                        ) } 
                    </div>

                </form>
            </div>
            </div>
        );
}

export default LoginPage;
