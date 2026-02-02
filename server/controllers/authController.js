const User = require('../models/userModel');
const bcrypt = require('bcryptjs'); // You will need to install bcryptjs
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine approval status
        // Admin creates authorized users, or auto-approved roles (candidate)
        // If role is recruiter, they need approval.
        // If role is candidate, auto-approve.
        // If role is admin, should theoretically be approved but we seed the main admin.

        let isApproved = true;
        if (role === 'recruiter') {
            isApproved = false;
        }

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: role || 'candidate', // Default to candidate now? Or recruiter? User said "recruiters register... candidates use normally". Let's default to candidate for safety or recruiter if that was previous behavior. Previous default was recruiter.
            isAdmin: role === 'admin',
            isApproved
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isApproved: user.isApproved,
                resume: user.resume,
                resumeOriginalName: user.resumeOriginalName,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isApproved && user.role === 'recruiter') {
                return res.status(401).json({ message: 'Account pending approval by Admin.' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isAdmin: user.isAdmin,
                resume: user.resume,
                resumeOriginalName: user.resumeOriginalName,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed Admin User
const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@gmail.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin@123', salt);

            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isAdmin: true,
                isApproved: true
            });
            console.log('Admin user created');
        }
    } catch (error) {
        console.error('Error seeding admin', error);
    }
}

// @desc    Get pending recruiters
// @route   GET /api/auth/pending
// @access  Private (Admin)
const getPendingRecruiters = async (req, res) => {
    try {
        const users = await User.find({ role: 'recruiter', isApproved: false }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all candidates
// @route   GET /api/auth/candidates
// @access  Private (Admin)
const getCandidates = async (req, res) => {
    try {
        const users = await User.find({ role: 'candidate' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve recruiter
// @route   PUT /api/auth/approve/:id
// @access  Private (Admin)
const approveRecruiter = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isApproved = true;
            await user.save();
            res.json({ message: 'Recruiter approved' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                isAdmin: updatedUser.isAdmin,
                resume: updatedUser.resume,
                resumeOriginalName: updatedUser.resumeOriginalName,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all recruiters (Approved & Pending)
// @route   GET /api/auth/recruiters
// @access  Private (Admin)
const getRecruiters = async (req, res) => {
    try {
        const users = await User.find({ role: 'recruiter' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Admin Stats (Users, Jobs, Applications)
// @route   GET /api/auth/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
    try {
        const totalCandidates = await User.countDocuments({ role: 'candidate' });
        const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        const activeJobs = await require('../models/jobModel').countDocuments({ status: 'active' });

        // Count total applications (resumes)
        // Since resumes are applications, we count them.
        // Ideally we might want applications per job for the chart.
        const totalApplications = await require('../models/resumeModel').countDocuments();

        // For the chart: Applications per Job (Top 5)
        const jobs = await require('../models/jobModel').find({ status: 'active' }).select('title _id');
        const chartData = [];

        for (const job of jobs) {
            const count = await require('../models/resumeModel').countDocuments({ job: job._id });
            if (count > 0) {
                chartData.push({ name: job.title, applications: count });
            }
        }

        // Sort by applications desc and take top 5
        chartData.sort((a, b) => b.applications - a.applications);
        const topJobs = chartData.slice(0, 5);

        res.json({
            candidates: totalCandidates,
            recruiters: totalRecruiters,
            jobs: activeJobs,
            applications: totalApplications,
            chartData: topJobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Deactivate recruiter
// @route   PUT /api/auth/deactivate/:id
// @access  Private (Admin)
const deactivateRecruiter = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isApproved = false;
            await user.save();
            res.json({ message: 'Recruiter deactivated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Candidate Details (Profile + Applications)
// @route   GET /api/auth/candidate/:id
// @access  Private (Admin)
const getCandidateDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Fetch all resumes/applications by this user
        // We use the 'user' field in Resume model which references the User ID
        const applications = await require('../models/resumeModel')
            .find({ user: user._id })
            .populate('job', 'title department location')
            .sort({ createdAt: -1 });

        res.json({
            user,
            applications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, seedAdmin, getPendingRecruiters, approveRecruiter, deactivateRecruiter, getCandidates, updateUserProfile, getRecruiters, getAdminStats, getCandidateDetails };
