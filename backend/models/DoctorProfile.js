// File: models/DoctorProfile.js
const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    // Section 1: Identity & Verification
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    profilePhotoPath: { type: String, required: true },
    idProofPath: { type: String, required: true },

    // Section 2: Professional & Medical Verification
    medicalRegNumber: { type: String, required: true },
    qualification: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    regCertificatePath: { type: String, required: true },
    degreeCertificatePath: { type: String, required: true },

    // Section 3: Practice Locations (Array to store multiple locations)
    practiceLocations: [{
        clinicName: { type: String, required: true },
        clinicAddress: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }],
    
    // Online Consultation Timings
    onlineConsultation: {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    },

    // Admin Verification Status
    isVerifiedByAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.DoctorProfile || mongoose.model('DoctorProfile', doctorProfileSchema);
