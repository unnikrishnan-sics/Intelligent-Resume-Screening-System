const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadResume, getResumesByJob, getResumeById, getMyResumes, uploadProfileResume,
    deleteProfileResume,
    checkApplicationStatus,
    exportResumesToCSV
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()} -${file.originalname} `);
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /pdf|doc|docx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype); // Simplistic check

    if (extname) { // mimetype check can be flaky for docs
        return cb(null, true);
    } else {
        cb('Error: Resumes Only (PDF, DOC, DOCX)!');
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/profile', protect, upload.single('resume'), uploadProfileResume);
router.delete('/profile', protect, deleteProfileResume);

router.get('/my-resumes', protect, getMyResumes);
// router.get('/check/:jobId', protect, checkApplicationStatus);
// router.get('/job/:jobId', protect, getResumesByJob);
// router.get('/job/:jobId/export', protect, exportResumesToCSV);
// router.get('/:id', protect, getResumeById);

module.exports = router;
