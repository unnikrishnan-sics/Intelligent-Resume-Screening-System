const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resume = require('./models/resumeModel');

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

const verifyData = async () => {
    await connectDB();

    const resume = await Resume.findOne().sort({ createdAt: -1 });
    if (resume) {
        console.log('Latest Resume Found:');
        console.log('ID:', resume._id);
        console.log('Score:', resume.similarityScore);
        if (resume.parsedData) {
            console.log('Parsed Data Exists');
            console.log('Skills:', resume.parsedData.extracted_skills);
        } else {
            console.log('Parsed Data MISSING');
        }
    } else {
        console.log('No resume found');
    }
    process.exit();
};

verifyData();
