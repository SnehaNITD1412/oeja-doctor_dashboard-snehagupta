// File: controllers/prescriptions.controller.js
const Prescription = require('../models/Prescription');
const { sendEmail } = require('../utils/email');
const emailTemplates = require('../utils/emailTemplates');

const ok = (res, data) => res.status(200).json({ success: true, data });
const bad = (res, error) => res.status(400).json({ success: false, error });

exports.list = async (req, res) => {
    try {
        const { patientId } = req.query;
        const items = await Prescription.find({ patientId }).sort({ createdAt: -1 });
        return ok(res, items);
    } catch (e) {
        return bad(res, e.message);
    }
};

exports.create = async (req, res) => {
    try {
        const { patientId, doctorId, medicines, advice } = req.body;
        
        if (!patientId || !medicines || !Array.isArray(medicines)) {
            return bad(res, 'patientId and medicines array are required');
        }
        
        const doc = await Prescription.create({ 
            patientId, 
            doctorId: doctorId || req.user._id || req.user.id, 
            medicines: medicines || [], 
            advice 
        });
        
        // Send email notification to patient (if email available)
        try {
            // You might want to get patient email from Patient model
            // For now, we'll just log it
            console.log('New prescription created:', { 
                prescriptionId: doc._id, 
                patientId, 
                medicinesCount: medicines.length 
            });
            
            // TODO: Get patient email and send notification
            // if (patientEmail) {
            //     await sendEmail({
            //         to: patientEmail,
            //         subject: 'New Prescription Available',
            //         html: emailTemplates.newPrescription(doc, patientName)
            //     });
            // }
            
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails
        }
        
        return ok(res, doc);
    } catch (e) {
        return bad(res, e.message);
    }
};
