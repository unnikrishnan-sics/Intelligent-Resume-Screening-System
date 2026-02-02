const express = require('express');
const { registerUser, loginUser, getPendingRecruiters, approveRecruiter, deactivateRecruiter, getCandidates, updateUserProfile, getRecruiters, getAdminStats, getCandidateDetails } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { protectAdmin } = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/pending', protect, protectAdmin, getPendingRecruiters);
router.get('/candidates', protect, protectAdmin, getCandidates);
router.get('/candidate/:id', protect, protectAdmin, getCandidateDetails);
router.get('/recruiters', protect, protectAdmin, getRecruiters);
router.get('/stats', protect, protectAdmin, getAdminStats);
router.put('/approve/:id', protect, protectAdmin, approveRecruiter);
router.put('/deactivate/:id', protect, protectAdmin, deactivateRecruiter);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
