const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { protectAdmin } = require('../middleware/adminMiddleware');

router.post('/', sendMessage);
router.get('/', protect, protectAdmin, getMessages);
router.delete('/:id', protect, protectAdmin, deleteMessage);

module.exports = router;
