// File: models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true, index: true },
    patientId: { type: String,ref:'User', required: true, index: true }, // keeping as string to match P1001 format
    date: { type: Date, required: true, index: true },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },
    status: { type: String, enum: ['pending','approved','rejected','completed','no_show','cancelled'], default: 'pending' },
    patientName: { type: String },
    patientEmail: { type: String },
    problem: { type: String },
    reachedMeeting: { type: Boolean, default: false },
    meetLink: { type: String }
}, { timestamps: true });

appointmentSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);


