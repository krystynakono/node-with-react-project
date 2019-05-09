const express = require("express");
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
// Model will need to be defined before we try to make use of it in the passport file
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// maxAge is how long a cookie can exist in the browser before it is automatically expired (millisecond)
// keys is used to encrypt our cookie (array allows multiple keys that is will picked randomly for an added level of security)
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

// immediately invoke the function that is returned from authRoutes
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);