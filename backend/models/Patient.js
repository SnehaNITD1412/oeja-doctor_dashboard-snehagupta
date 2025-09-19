// File: models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    gender: { type: String },
    age: { type: Number },
    email: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);


