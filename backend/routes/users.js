const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {

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
            error: err
          });
        });
    });

});

router.post('/login', (req, res, next) => {

  let fechedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      fechedUser = user;
      return bcrypt.compare(req.body.password, fechedUser.password); // Return a promise
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      const token = jsonwt.sign(
        { email: fechedUser.email, userId: fechedUser._id },
        'secret_that_should-be_longer',
        { expiresIn: '1h' }
      ); // Create new token based on data passed into.
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed'
      });
    });

});

module.exports = router;
