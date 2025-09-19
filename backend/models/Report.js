// File: models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    patientId: { type: String, required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, required: false },
    type: { type: String, required: true },
    title: { type: String, required: true },
    notes: { type: String },
    // Support multiple files per report upload
    files: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);




