const userDB = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

exports.register = async (req, res) => {
    try {
        const { name, role, email, password, profileImage } = req.body;
        const existingUser = await userDB.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userDB.create({ name, role, email, password : hashedPassword, profileImage });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            profileImage: user.profileImage,
            token: generateToken(user)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userDB.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
                profileImage: user.profileImage,
                token: generateToken(user)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
