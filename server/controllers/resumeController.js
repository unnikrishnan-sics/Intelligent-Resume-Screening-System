const Resume = require('../models/resumeModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// ... existing imports ...

const Job = require('../models/jobModel');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// @desc    Upload a resume
// @route   POST /api/resumes/upload
// @access  Public (Candidate) or Private (Recruiter)
const uploadResume = async (req, res) => {
    if (!req.file && !req.body.useProfileResume) {
        return res.status(400).json({ message: 'No file uploaded and no profile resume selected' });
    }

    const { jobId, candidateName, email, phone, useProfileResume } = req.body;

    // Basic validation
    if (!jobId || !candidateName || !email) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Job not found' });
        }

        let filePath, fileName;

        if (useProfileResume === 'true' || useProfileResume === true) {
            // Check if user has profile resume
            const user = await require('../models/userModel').findById(req.user.id);
            if (!user || !user.resume) {
                return res.status(400).json({ message: 'No profile resume found' });
            }
            // Copy file to avoid conflicts if profile is changed/deleted later
            const ext = path.extname(user.resume);
            fileName = `profile-apply-${req.user.id}-${Date.now()}${ext}`;
            filePath = path.join('uploads', fileName);

            try {
                fs.copyFileSync(user.resume, filePath);
            } catch (err) {
                return res.status(500).json({ message: 'Failed to process profile resume: ' + err.message });
            }
        } else {
            filePath = req.file.path;
            fileName = req.file.filename;
        }

        const resume = await Resume.create({
            job: jobId,
            user: req.user ? req.user.id : null,
            candidateName,
            email,
            phone,
            filePath: filePath,
            fileName: fileName
        });

        // Trigger Python Script for Parsing & Scoring
        // We do this asynchronously and don't wait for it to return to the client immediately
        // Or we can wait if we want real-time results. For now, let's wait to return the parsed result.

        // Call ML Engine API
        try {
            const absoluteFilePath = path.resolve(filePath);
            const mlResponse = await axios.post('http://127.0.0.1:5001/parse', {
                filePath: absoluteFilePath,
                requirements: job.requirements || []
            });

            const results = mlResponse.data;

            // Update resume with results
            resume.parsedData = results.parsedData;
            resume.similarityScore = results.score;
            resume.classification = results.classification;
            await resume.save();

        } catch (mlError) {
            console.error('ML Engine Error:', mlError.message);
            resume.mlError = mlError.message; // Add info to resume object in memory (not saved to DB unless schema allows)
            // Or just return error in response
            return res.status(200).json({ ...resume.toObject(), mlError: mlError.message, mlStatus: mlError.response ? mlError.response.status : 'Unknown' });
        }

        res.status(201).json(resume);

    } catch (error) {
        // Cleanup file on error
        const filePath = req.file ? req.file.path : undefined;
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get resumes for a job
// @route   GET /api/resumes/job/:jobId
// @access  Private
const getResumesByJob = async (req, res) => {
    try {
        const resumes = await Resume.find({ job: req.params.jobId }).sort({ similarityScore: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id).populate('job');
        if (resume) {
            // Check ownership or role
            if (req.user.role !== 'recruiter' && !req.user.isAdmin && resume.user.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            res.status(200).json(resume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get resumes for logged-in user
// @route   GET /api/resumes/my-resumes
// @access  Private
const getMyResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id }).populate('job').sort({ createdAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload profile resume
// @route   POST /api/resumes/profile
// @access  Private
const uploadProfileResume = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const user = await require('../models/userModel').findById(req.user.id);

        // If existing resume, delete old file (optional, but good for cleanup)
        if (user.resume && fs.existsSync(user.resume)) {
            try {
                fs.unlinkSync(user.resume);
            } catch (err) {
                console.error("Failed to delete old resume", err);
            }
        }

        user.resume = req.file.path;
        user.resumeOriginalName = req.file.originalname;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin,
            resume: user.resume,
            resumeOriginalName: user.resumeOriginalName,
            token: generateToken(user._id)
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete profile resume
// @route   DELETE /api/resumes/profile
// @access  Private
const deleteProfileResume = async (req, res) => {
    try {
        const user = await require('../models/userModel').findById(req.user.id);

        if (user.resume) {
            if (fs.existsSync(user.resume)) {
                fs.unlinkSync(user.resume);
            }
            user.resume = undefined;
            user.resumeOriginalName = undefined;
            await user.save();
        }

        res.status(200).json({ message: 'Resume removed from profile' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if user has applied for a job
// @route   GET /api/resumes/check/:jobId
// @access  Private
const checkApplicationStatus = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            job: req.params.jobId,
            user: req.user.id
        });

        if (resume) {
            return res.json({ applied: true, resumeId: resume._id });
        } else {
            return res.json({ applied: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadResume,
    getResumesByJob,
    getResumeById,
    getMyResumes,
    uploadProfileResume,
    deleteProfileResume,
    checkApplicationStatus
};
