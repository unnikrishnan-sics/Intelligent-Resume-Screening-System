const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide name, email and message' });
        }

        const newMessage = await Message.create({
            name,
            email,
            message
        });

        res.status(201).json({
            success: true,
            data: newMessage,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Contact Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
