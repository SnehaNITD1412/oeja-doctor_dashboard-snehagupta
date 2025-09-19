// File: models/Availability.js
const mongoose = require('mongoose');

const dailyWindowSchema = new mongoose.Schema({
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0=Sun..6=Sat
    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true },   // e.g. "17:00"
    slotMinutes: { type: Number, default: 30 }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    windows: [dailyWindowSchema]
}, { timestamps: true });

module.exports = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);


