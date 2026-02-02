const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        default: 'General'
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'Full-time'
    },
    requirements: {
        type: [String],
        required: true,
        default: []
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    passingThreshold: {
        type: Number,
        default: 60,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
