const express = require('express');
const router = express.Router();

const UserService = require('../services/user-service');

router.post('/signup', UserService.createUser);

router.post('/login', UserService.userLogin);

module.exports = router;
