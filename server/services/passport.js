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
  (accessToken, refreshToken, profile, done) => {
    // look through users collection and find first collection with googleId (async code)
    User.findOne({
        googleId: profile.id
      })
      .then(existingUser => {
        if (existingUser) {
          // we already have a record with the given profile ID
          // tells passport there is no error and sends back existing user
          done(null, existingUser);
        } else {
          // we don't have a user record with this ID, make a new user

          // creates a new instance of a user
          const newUser = new User({
            googleId: profile.id
          });
          // when we call save, it will take the model instance and save it to the database for us
          newUser.save().then(user => done(null, user));
        }
      })
  }
));