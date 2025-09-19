// File: models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    patientId: { type: String, required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    from: { type: String, enum: ['doctor', 'patient'], required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);




