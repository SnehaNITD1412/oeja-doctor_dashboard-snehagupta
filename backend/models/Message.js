// File: models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    patientId: { type: String, required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    sender: { type: String, enum: ['patient', 'doctor'], required: true },
    text: { type: String, required: true },
    attachments: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);




