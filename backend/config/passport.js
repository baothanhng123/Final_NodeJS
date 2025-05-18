const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const config = require('./main');

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Kiểm tra xem có email từ Google không
            if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
                return done(new Error('Email not provided by Google'));
            }

            const email = profile.emails[0].value;
            const googleId = profile.id;
            const fullname = profile.displayName || 'User';
            const profileImage = profile.photos?.[0]?.value || '';

            // First try to find user by googleId
            let user = await User.findOne({ googleId: googleId });
            
            if (!user) {
                // If no user found by googleId, check by email
                user = await User.findOne({ email: email });
                
                if (user) {
                    // If user exists with this email but different auth type
                    if (user.authType !== 'google') {
                        return done(null, false, { 
                            message: `This email is already registered using ${user.authType} authentication. Please use that method to login.`
                        });
                    }
                } else {
                    // Create new user if no existing user found
                    user = await User.create({
                        email: email,
                        googleId: googleId,
                        fullname: fullname,
                        profileImage: profileImage,
                        authType: 'google'
                    });
                }
            }

            // Update user's Google-related info
            user.googleId = googleId;
            if (!user.profileImage && profileImage) {
                user.profileImage = profileImage;
            }
            if (!user.fullname && fullname) {
                user.fullname = fullname;
            }
            await user.save();

            return done(null, user);
        } catch (error) {
            console.error('Google authentication error:', error);
            return done(error);
        }
    }));
}


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport; 