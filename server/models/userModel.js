const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['recruiter', 'admin', 'candidate'],
        default: 'recruiter'
    },
    resume: {
        type: String, // Path to resume file
        required: false
    },
    resumeOriginalName: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
