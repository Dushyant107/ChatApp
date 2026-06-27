import { generateToken } from "../library/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../library/clodinary.js";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


// Sign-up
export const signUp = async (req,res)=>{

    const {fullName,email,password,bio}=req.body;

    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success : false,message:"Missing Details"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.json({success : false,message:"User already exists for this email"});
        }

        const salt= await bcrypt.genSalt(10);
        const hashedpass= await bcrypt.hash(password,salt);

        const newUser= await User.create({
            fullName,email,password:hashedpass,bio
        });

        const token = generateToken(newUser._id);
        res.json({success: true , userData:newUser, token ,message : "Account succesfully created"});

    } catch (error) {
        console.log(error.message);
        res.json({success : false,message:error.message});
    }
}

// Login
export const login = async (req,res)=>{

    const {email,password}=req.body;

    try {
        if(!email || !password ){
            return res.json({success : false,message:"Missing Details"});
        }
        const userData = await User.findOne({email});
        if(!userData){
            res.json({success:false,messgae:"User doesnot exist for this email"});
        }
        const isPassCorrect = await bcrypt.compare(password,userData.password)

        if(!isPassCorrect){
            return res.json({success : false,message:"Invalid Details"});
        }

        const token = generateToken(userData._id);
        res.json({success: true , userData, token ,message : "Login succesfull"});

    } catch (error) {
        console.log(error.message);
        res.json({success : false , message:error.message});
    }
}

// To check if user is authenticated
export const checkAuth = (req,res)=>{
    res.json({success:true,user:req.user});
}

// To update user profile
export const updateProfile = async (req,res)=>{

    try {
        const { profilePic,bio,fullName }=req.body;
        const userId=req.user._id;

        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true}); 
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url ,bio,fullName},{new:true}); 
        }
        res.json({success:true,user:updatedUser});
    } catch (error) {
        res.json({success:false,message:error.message});
        
    }
}

// // login user with google
// passport.use(new GoogleStrategy({
//     clientID:process.env.GOGGLE_CLIENT_ID,
//     clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:"http://localhost:5000/api/auth/google/callback",}
//     ),  async(accessToken,refreshToken,profile,done)=>{
//         try{let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//             user = await User.create({
//             googleId: profile.id,
//             fullName: profile.displayName,
//             email: profile.emails[0].value,
//             profilePic: profile.photos[0].value,
//           });
//         }
//           return done(null, user);
//         } catch (err) {
//         return done(err, null);
//    }
//     }
       
// );

// // Serialize user to store in session
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user for subsequent requests
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });

// export const googleLoginHandler = (req, res) => {
//   // At this point, passport has attached the user to req.user
//   const token = generateToken(req.user._id);
//   res.json({ success: true, user: req.user, token });
// };