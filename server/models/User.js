const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const userSchema = new Schema({
  googleId: String,
  credits: {
    type: Number,
    default: 0
  }
});

// two arguments means we are trying to load something in
mongoose.model('users', userSchema);