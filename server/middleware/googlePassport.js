import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { generateToken } from '../library/utils.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // find or create user in your DB
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          fullName: profile.displayName,
          email: profile.emails?.[0]?.value,
          googleId: profile.id,
          profilePic: profile.photos?.[0]?.value,
          bio: '' // or default
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// For JWT-based flow you may skip serialize/deserialize (or use minimal)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
