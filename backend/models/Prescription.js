// File: models/Prescription.js
const mongoose = require('mongoose');

const timingsSchema = new mongoose.Schema({
    morning: { type: Boolean, default: false },
    afternoon: { type: Boolean, default: false },
    night: { type: Boolean, default: false }
}, { _id: false });

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosageMg: { type: Number },
    dose: { type: String },
    timings: { type: timingsSchema, default: () => ({}) },
    days: { type: Number }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
    patientId: { type: String, required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, required: false, index: true },
    medicines: [medicineSchema],
    advice: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);




