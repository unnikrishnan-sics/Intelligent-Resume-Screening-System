const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Job'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    candidateName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    filePath: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    parsedData: {
        skills: [String],
        education: [String],
        experience: [String],
        // flexible structure for other parsed fields
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    similarityScore: {
        type: Number,
        default: 0
    },
    classification: {
        type: String,
        enum: ['Highly Suitable', 'Moderately Suitable', 'Not Suitable', 'Pending'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
