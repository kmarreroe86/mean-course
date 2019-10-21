const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

mongoose.plugin(uniqueValidator); // mongoose will validate for no repeated user's email.

module.exports = mongoose.model('User', userSchema);
