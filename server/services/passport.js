const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

// one argument means we are trying to fetch something out
const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  // user.id is the ID that was assigned to this record by Mongo
  // this is helpful if there are multiple forms of sign in (Facebook, LinkedIn, etc)
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({
      googleId: profile.id
    });

    if (existingUser) {
      return done(null, existingUser);
    }

    // when we call save, it will take the model instance and save it to the database for us
    const newUser = new User({
      googleId: profile.id
    });
    const user = await newUser.save()
    done(null, user);
  }
));