const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken');

const User = require('../models/user');


exports.createUser = (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created successfully.',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid registration credentials'
          });
        });
    });
};

exports.userLogin = (req, res, next) => {

  let fechedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid authentication credentials'
        });
      }
      fechedUser = user;
      return bcrypt.compare(req.body.password, fechedUser.password); // Return a promise
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Invalid authentication credentials'
        });
      }
      const token = jsonwt.sign(
        { email: fechedUser.email, userId: fechedUser._id },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      ); // Create new token based on data passed into.
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fechedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'You are not authenticated'
      });
    });
};
