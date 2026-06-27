import express from "express";
import {signUp,login, updateProfile, checkAuth} from "../controller/userController.js"
import {protectRoutes} from "../middleware/auth.js"
import passport from 'passport';;

const userRouter = express.Router();

userRouter.post("/signup",signUp);
userRouter.post("/login",login);


userRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

userRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.json({ success: true, user: req.user, token });
  }
);


userRouter.put("/update-profile",protectRoutes,updateProfile);
userRouter.get("/check",protectRoutes,checkAuth);

export default userRouter;
