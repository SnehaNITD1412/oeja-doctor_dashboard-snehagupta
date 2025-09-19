// File: controllers/dev.controller.js
const Patient = require('../models/Patient');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');
const Prescription = require('../models/Prescription');
const Message = require('../models/Message');
const Feedback = require('../models/Feedback');

const ok = (res, data) => res.status(200).json({ success: true, data });
const bad = (res, error) => res.status(400).json({ success: false, error });

exports.seedDemoData = async (req, res) => {
    try {
        // Use fixed doctorId from token if present; otherwise, random ObjectId-like string
        const doctorId = (req.user && (req.user._id || req.user.id)) || undefined;

        // 1) Patient
        const patientId = 'P1001';image.png
        await Patient.findOneAndUpdate(
            { patientId },
            { patientId, name: 'John Doe', gender: 'Male', age: 30, email: 'john.doe@example.com' },
            { upsert: true, new: true }
        );

        // 2) Availability (Mon-Fri, 09:00-12:00, 30min)
        if (doctorId) {
            await Availability.findOneAndUpdate(
                { doctorId },
                { doctorId, windows: [
                    { dayOfWeek: 1, startTime: '09:00', endTime: '12:00', slotMinutes: 30 },
                    { dayOfWeek: 2, startTime: '09:00', endTime: '12:00', slotMinutes: 30 },
                    { dayOfWeek: 3, startTime: '09:00', endTime: '12:00', slotMinutes: 30 },
                    { dayOfWeek: 4, startTime: '09:00', endTime: '12:00', slotMinutes: 30 },
                    { dayOfWeek: 5, startTime: '09:00', endTime: '12:00', slotMinutes: 30 }
                ] },
                { upsert: true, new: true }
            );
        }

        // Helper dates
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

        // 3) Appointments: pending, approved (today), completed (yesterday)
        await Appointment.deleteMany({ patientId });
        const appts = await Appointment.insertMany([
            { doctorId, patientId, patientName: 'John Doe', patientEmail: 'john.doe@example.com', problem: 'Headache', date: todayStr, startTime: '09:00', endTime: '09:30', status: 'pending' },
            { doctorId, patientId, patientName: 'John Doe', patientEmail: 'john.doe@example.com', problem: 'Follow-up', date: todayStr, startTime: '10:00', endTime: '10:30', status: 'approved', meetLink: 'https://meet.google.com/seed-demo' },
            { doctorId, patientId, patientName: 'John Doe', patientEmail: 'john.doe@example.com', problem: 'Checkup', date: yesterday, startTime: '11:00', endTime: '11:30', status: 'completed', reachedMeeting: true }
        ]);

        // 4) Reports
        await Report.deleteMany({ patientId });
        await Report.insertMany([
            { patientId, title: 'CBC', type: 'lab', notes: 'All normal', fileUrl: undefined, createdAt: new Date() },
            { patientId, title: 'X-Ray Chest', type: 'xray', notes: 'No abnormality', fileUrl: undefined, createdAt: new Date() }
        ]);

        // 5) Prescriptions
        await Prescription.deleteMany({ patientId });
        await Prescription.insertMany([
            { patientId, doctorId, medicines: [
                { name: 'Paracetamol', dosageMg: 500, dose: '1', timings: { morning: true, afternoon: false, night: true }, days: 3 },
                { name: 'Pantoprazole', dosageMg: 40, dose: '1', timings: { morning: true, afternoon: false, night: false }, days: 5 }
            ], advice: 'Hydrate well' }
        ]);

        // 6) Messages (Inbox)
        await Message.deleteMany({ patientId });
        await Message.insertMany([
            { patientId, doctorId, sender: 'patient', text: 'Hello doctor, I have a headache' },
            { patientId, doctorId, sender: 'doctor', text: 'Please take rest and hydrate.' }
        ]);

        // 7) Feedback (both directions)
        await Feedback.deleteMany({ patientId });
        await Feedback.insertMany([
            { patientId, doctorId, from: 'doctor', rating: 5, comment: 'Doing great' },
            { patientId, doctorId, from: 'patient', rating: 4, comment: 'Very helpful' }
        ]);

        return ok(res, { message: 'Seeded demo data for patient P1001', appointmentIds: appts.map(a => a._id) });
    } catch (e) {
        return bad(res, e.message);
    }
};
