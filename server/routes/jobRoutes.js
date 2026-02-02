const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, createJob);
router.route('/my-jobs').get(protect, require('../controllers/jobController').getMyJobs);
router.route('/:id').get(getJobById).put(protect, updateJob).delete(protect, deleteJob);

module.exports = router;
