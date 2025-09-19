const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Import the Message model
const mongoose = require('mongoose');
const { requireAuth } = require('../middleware/auth');

// Protect all message routes
router.use(requireAuth);

/**
 * @route   GET /api/messages/conversations
 * @desc    Get all unique patient conversations for a doctor
 * @access  Private
 */
router.get('/conversations', async (req, res) => {
    try {
        const doctorId = new mongoose.Types.ObjectId(req.user._id);

        const conversations = await Message.aggregate([
            // ... baaki ka aggregation code waisa hi rahega ...
            { $match: { doctorId: doctorId } },
            { $sort: { createdAt: -1 } },
            { 
                $group: {
                    _id: "$patientId",
                    lastMessage: { $first: "$text" },
                    lastMessageTimestamp: { $first: "$createdAt" },
                    docId: { $first: "$doctorId" }
                }
            },
            { $sort: { lastMessageTimestamp: -1 } },
            { 
                $project: {
                    _id: 0,
                    patientId: "$_id",
                    lastMessage: "$lastMessage",
                    date: "$lastMessageTimestamp"
                }
            }
        ]);
        res.json(conversations);
    } catch (err) {
        // Agar ID invalid hogi toh yeh error aayega
        console.error("Error fetching conversations:", err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/messages (alias) or GET /chats (when mounted at /chats)
 * @desc    Get all unique patient conversations for a doctor
 * @access  Private
 */
router.get('/', async (req, res) => {
    try {
        const doctorId = new mongoose.Types.ObjectId(req.user._id);

        const conversations = await Message.aggregate([
            { $match: { doctorId: doctorId } },
            { $sort: { createdAt: -1 } },
            { 
                $group: {
                    _id: "$patientId",
                    lastMessage: { $first: "$text" },
                    lastMessageTimestamp: { $first: "$createdAt" },
                    docId: { $first: "$doctorId" }
                }
            },
            { $sort: { lastMessageTimestamp: -1 } },
            { 
                $project: {
                    _id: 0,
                    patientId: "$_id",
                    lastMessage: "$lastMessage",
                    date: "$lastMessageTimestamp"
                }
            }
        ]);
        res.json(conversations);
    } catch (err) {
        console.error("Error fetching conversations (alias):", err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/messages/:patientId
 * @desc    Get all messages with a specific patient
 * @access  Private
 */
router.get('/:patientId', async (req, res) => {
    try {
        const doctorId = new mongoose.Types.ObjectId(req.user._id);
        const patientId = req.params.patientId;

        const messages = await Message.find({
            doctorId: doctorId,
            patientId: patientId
        }).sort({ createdAt: 'asc' });

        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages for patient:", err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   POST /api/messages
 * @desc    Send a new message (from the doctor)
 * @access  Private
 */
router.post('/', async (req, res) => {
    try {
        const { patientId, text } = req.body;
        const doctorId = new mongoose.Types.ObjectId(req.user._id);

        if (!patientId || !text) {
            return res.status(400).json({ msg: 'Patient ID and text are required.' });
        }

        const newMessage = new Message({
            patientId,
            text,
            doctorId: doctorId,
            sender: 'doctor'
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        console.error("Error sending message:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;