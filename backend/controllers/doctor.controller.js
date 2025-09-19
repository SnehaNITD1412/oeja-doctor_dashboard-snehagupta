// File: controllers/doctor.controller.js
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
exports.submitProfileForm = async (req, res) => {
    // req.files is an object that contains all uploaded files
    // Example: { profilePhoto: [file1], idProof: [file2], ... }
    if (!req.files || Object.keys(req.files).length < 4) {
        return res.status(400).json({ success: false, error: 'All 4 documents are required.' });
    }

    const {
        fullName, gender, dob, contactNumber,
        medicalRegNumber, qualification, specialization, experience,
        practiceLocations, // This will be a JSON string from the frontend
        onlineStartTime, onlineEndTime
    } = req.body;

    try {
        // Parse the JSON string from the frontend back into a JavaScript array
        let rawLocations = practiceLocations || [];
        if (typeof practiceLocations === 'string') {
            try {
                rawLocations = JSON.parse(practiceLocations);
            } catch (e) {
                return res.status(400).json({ success: false, error: 'Invalid practiceLocations JSON' });
            }
        }

        // Some frontends may send slightly different key names. Normalize them.
        const normalizedLocations = (rawLocations || []).map((loc) => ({
            clinicName: loc.clinicName || loc.clinic || loc.name || '',
            clinicAddress: loc.clinicAddress || loc.address || '',
            startTime: loc.startTime || loc.clinicStartTime || loc.start || '',
            endTime: loc.endTime || loc.clinicEndTime || loc.end || ''
        })).filter(l => l.clinicName && l.clinicAddress && l.startTime && l.endTime);

        const profilePayload = {
            user: req.user._id || req.user.id,
            fullName,
            gender,
            dob,
            contactNumber,
            medicalRegNumber,
            qualification,
            specialization,
            experience: Number.isFinite(Number(experience)) ? Number(experience) : 0,
            practiceLocations: normalizedLocations,
            onlineConsultation: {
                startTime: onlineStartTime,
                endTime: onlineEndTime
            }
        };

        // Uploaded files are optional during update
        if (req.files && req.files.profilePhoto && req.files.profilePhoto[0]) {
            profilePayload.profilePhotoPath = req.files.profilePhoto[0].path;
        }
        if (req.files && req.files.idProof && req.files.idProof[0]) {
            profilePayload.idProofPath = req.files.idProof[0].path;
        }
        if (req.files && req.files.regCertificate && req.files.regCertificate[0]) {
            profilePayload.regCertificatePath = req.files.regCertificate[0].path;
        }
        if (req.files && req.files.degreeCertificate && req.files.degreeCertificate[0]) {
            profilePayload.degreeCertificatePath = req.files.degreeCertificate[0].path;
        }

        // If the profile already exists, update it; otherwise create a new one
        const existing = await DoctorProfile.findOne({ user: req.user._id || req.user.id });
        if (existing) {
            await DoctorProfile.updateOne({ _id: existing._id }, profilePayload);
        } else {
            await DoctorProfile.create(profilePayload);
        }

        // Mark the profile as complete on the User model
        await User.findByIdAndUpdate(req.user._id || req.user.id, { isProfileComplete: true });

        res.status(200).json({
            success: true,
            message: 'Profile submitted successfully. It will be reviewed by our team.'
        });

    } catch (error) {
        console.error('Profile submission error:', error);
        res.status(500).json({ success: false, error: 'Server Error: Could not save profile.' });
    }
};

// Fetch doctor dashboard data
exports.getDoctorDashboardData = async (req, res) => {
    try {
        const profile = await DoctorProfile.findOne({ user: req.user.id })
            .populate('user', ['firstName', 'lastName', 'email']);

        if (!profile) {
            return res.status(404).json({ success: false, error: 'Doctor profile not found.' });
        }

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Lightweight endpoint to update practice locations and online consultation hours
exports.updatePracticeLocations = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { practiceLocations, onlineStartTime, onlineEndTime } = req.body;

        // Parse and normalize practice locations
        const rawLocations = typeof practiceLocations === 'string' 
            ? JSON.parse(practiceLocations) 
            : (practiceLocations || []);

        const normalizedLocations = (rawLocations || []).map((loc) => ({
            clinicName: loc.clinicName || loc.clinic || loc.name || '',
            clinicAddress: loc.clinicAddress || loc.address || '',
            startTime: loc.startTime || loc.clinicStartTime || loc.start || '',
            endTime: loc.endTime || loc.clinicEndTime || loc.end || ''
        })).filter(l => l.clinicName && l.clinicAddress && l.startTime && l.endTime);

        const updatePayload = {};
        if (normalizedLocations.length) {
            updatePayload.practiceLocations = normalizedLocations;
        }
        if (onlineStartTime || onlineEndTime) {
            updatePayload.onlineConsultation = {
                ...(onlineStartTime ? { startTime: onlineStartTime } : {}),
                ...(onlineEndTime ? { endTime: onlineEndTime } : {}),
            };
        }

        if (!Object.keys(updatePayload).length) {
            return res.status(400).json({ success: false, error: 'No updatable fields provided.' });
        }

        const existing = await DoctorProfile.findOne({ user: userId });
        if (!existing) {
            return res.status(404).json({ success: false, error: 'Doctor profile not found. Please complete profile first.' });
        }

        await DoctorProfile.updateOne({ _id: existing._id }, updatePayload);

        return res.status(200).json({ success: true, message: 'Practice locations updated.' });
    } catch (error) {
        console.error('Update practice locations error:', error);
        return res.status(500).json({ success: false, error: 'Server Error: Could not update practice locations.' });
    }
};
// --- YEH NAYA FUNCTION FILE KE AAKHIR MEIN ADD KAREIN ---
exports.getDoctorAppointments = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Authentication error' });
        }
        
        const { status, from, to } = req.query;
        const query = { doctorId: req.user.id };

        if (status) {
            query.status = status;
        }
        if (from && to) {
            query.date = { $gte: new Date(from), $lte: new Date(to) };
        }

        const appointments = await Appointment.find(query)
            // populate() patient ki details (fullName, email) User model se le aayega
           
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};