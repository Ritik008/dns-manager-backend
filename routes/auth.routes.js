const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const { authController } = require('../controller');


router.post('/register', authController.register)

router.post('/login', authController.login)

module.exports = router;
