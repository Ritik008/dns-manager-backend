const User = require("../model/user.model");
const { createError } = require("../utils/error");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
    
        let user = await User.findOne({ email });
        if (user) {
          return next(createError(400, 'User already exists'));
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        user = new User({
          username,
          email,
          password: hashedPassword
        });
    
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error(error);
        next(error)
      }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
        if (!user) {
          return next(createError(400, 'Invalid credentials'))
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return next(createError(400, 'Invalid credentials'))
        }
    
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
        res.json({ token });
      } catch (error) {
        console.log(error)
        next(error);
      }
}

module.exports = {
    register,
    login
}