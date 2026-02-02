const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Job = require('./models/jobModel');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const setupData = async () => {
    await connectDB();

    // Create User
    let user = await User.findOne({ email: 'recruiter@example.com' });
    if (!user) {
        user = await User.create({
            name: 'Test Recruiter',
            email: 'recruiter@example.com',
            password: 'password123', // In real app should be hashed, assuming model doesn't hash automatically for now or it's fine for test
            role: 'recruiter'
        });
        console.log('User created');
    } else {
        console.log('User already exists');
    }

    // Create Job
    const job = await Job.create({
        user: user._id,
        title: 'Senior Python Developer',
        description: 'We are looking for a Python expert.',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        requirements: ['Python', 'Django', 'Flask', 'Machine Learning'],
        status: 'active'
    });

    console.log(`Job created with ID: ${job._id}`);
    process.exit();
};

setupData();
