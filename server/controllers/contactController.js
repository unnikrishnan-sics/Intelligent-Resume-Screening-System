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

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await Message.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Delete Message Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
