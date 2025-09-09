const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Employee', 'Team Lead', 'Project Lead', 'HR', 'CEO'], 
        required: true 
    },
    profileImage: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
