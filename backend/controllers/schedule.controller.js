// File: controllers/schedule.controller.js
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const { sendEmail } = require('../utils/email');
const { generateMeetLink } = require('../utils/meetLink');
const emailTemplates = require('../utils/emailTemplates');

const ok = (res, data) => res.status(200).json({ success: true, data });
const bad = (res, error) => res.status(400).json({ success: false, error });

exports.setAvailability = async (req, res) => {
    try {
        const doctorId = req.user._id || req.user.id;
        const { windows } = req.body; // [{dayOfWeek,startTime,endTime,slotMinutes}]
        if (!Array.isArray(windows)) return bad(res, 'windows must be an array');
        const doc = await Availability.findOneAndUpdate(
            { doctorId },
            { doctorId, windows },
            { upsert: true, new: true }
        );
        return ok(res, doc);
    } catch (e) {
        return bad(res, e.message);
    }
};

function toMinutes(t) { const [h,m] = t.split(':').map(Number); return h*60+m; }
function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function toHHMM(mins) { const h = Math.floor(mins/60), m = mins%60; return `${pad(h)}:${pad(m)}`; }

exports.getSlots = async (req, res) => {
    try {
        const doctorId = req.query.doctorId || (req.user._id || req.user.id);
        const dateStr = req.query.date; // YYYY-MM-DD
        if (!dateStr) return bad(res, 'date is required');
        const day = new Date(dateStr).getDay();
        const avail = await Availability.findOne({ doctorId });
        const dayWin = (avail?.windows || []).find(w => w.dayOfWeek === day);
        if (!dayWin) return ok(res, []);
        const start = toMinutes(dayWin.startTime);
        const end = toMinutes(dayWin.endTime);
        const step = dayWin.slotMinutes || 30;
        const slots = [];
        for (let t = start; t + step <= end; t += step) {
            slots.push({ startTime: toHHMM(t), endTime: toHHMM(t+step) });
        }
        // remove booked slots
        const booked = await Appointment.find({ doctorId, date: new Date(dateStr), status: { $in: ['pending','approved','completed'] } });
        const filtered = slots.filter(s => !booked.some(b => b.startTime === s.startTime));
        return ok(res, filtered);
    } catch (e) {
        return bad(res, e.message);
    }
};

exports.bookSlot = async (req, res) => {
    try {
        const doctorId = req.body.doctorId || (req.user._id || req.user.id);
        const { patientId, patientName, patientEmail, problem, date, startTime, endTime } = req.body;
        if (!patientId || !date || !startTime || !endTime) return bad(res, 'patientId, date, startTime, endTime are required');
        const appt = await Appointment.create({ doctorId, patientId, patientName, patientEmail, problem, date, startTime, endTime, status: 'pending' });
        return ok(res, appt);
    } catch (e) {
        return bad(res, e.message);
    }
};

exports.approveAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        let { meetLink } = req.body;
        
        // Get the appointment first
        const appointment = await Appointment.findById(id);
        if (!appointment) return bad(res, 'Appointment not found');
        
        // Generate meet link if not provided
        if (!meetLink) {
            meetLink = generateMeetLink('google');
        }
        
        // Update appointment
        const updatedAppt = await Appointment.findByIdAndUpdate(
            id, 
            { status: 'approved', meetLink }, 
            { new: true }
        );
        
        // Send emails to both parties
        try {
            if (appointment.patientEmail) {
                await sendEmail({
                    to: appointment.patientEmail,
                    subject: 'Appointment Approved - Join Your Consultation',
                    html: emailTemplates.appointmentApproved(appointment, meetLink)
                });
            }
            
            // Send confirmation to doctor (you might want to get doctor email from User model)
            // For now, we'll just log it
            console.log('Appointment approved:', { appointmentId: id, meetLink });
            
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails
        }
        
        return ok(res, updatedAppt);
    } catch (e) {
        return bad(res, e.message);
    }
};

exports.rejectAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        
        if (!reason) return bad(res, 'Rejection reason is required');
        
        // Get the appointment first
        const appointment = await Appointment.findById(id);
        if (!appointment) return bad(res, 'Appointment not found');
        
        // Update appointment
        const updatedAppt = await Appointment.findByIdAndUpdate(
            id, 
            { status: 'rejected', rejectReason: reason }, 
            { new: true }
        );
        
        // Send emails
        try {
            if (appointment.patientEmail) {
                await sendEmail({
                    to: appointment.patientEmail,
                    subject: 'Appointment Update - Status Changed',
                    html: emailTemplates.appointmentRejected(appointment, reason)
                });
            }
            
            // Log doctor confirmation
            console.log('Appointment rejected:', { appointmentId: id, reason });
            
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails
        }
        
        return ok(res, updatedAppt);
    } catch (e) {
        return bad(res, e.message);
    }
};

const mongoose = require('mongoose');

exports.getAppointments = async (req, res) => {
    try {
        const { patientId, status, from, to, id } = req.query;
        let query = {};

        // If an explicit appointment id is provided and looks like an ObjectId,
        // treat it as _id. Otherwise treat it as patientId.
        if (id) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                query._id = id;
            } else {
                query.patientId = id;
            }
        } else if (patientId) {
            query.patientId = patientId;
        }

        if (status) query.status = status;
        if (from && to) {
            query.date = { $gte: new Date(from), $lte: new Date(to) };
        }

        const items = await Appointment.find(query).sort({ date: -1, createdAt: -1 });
        return ok(res, items);
    } catch (e) {
        return bad(res, e.message);
    }
};

exports.getAppointmentStats = async (req, res) => {
    try {
        const { patientId, id } = req.query;

        let targetId = patientId || null;

        // If an appointment id was provided, and looks like an ObjectId,
        // fetch that appointment and derive the patientId from it.
        if (!targetId && id) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const appt = await Appointment.findById(id).lean();
                if (!appt) return bad(res, 'Appointment not found');
                targetId = appt.patientId;
            } else {
                targetId = id; // treat as patientId string
            }
        }

        if (!targetId) return bad(res, 'patientId or id is required');

        const byStatus = await Appointment.aggregate([
            { $match: { patientId: targetId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const reached = await Appointment.countDocuments({ patientId: targetId, reachedMeeting: true });
        const stats = byStatus.reduce((a, s) => (a[s._id] = s.count, a), {
            pending: 0, approved: 0, rejected: 0, completed: 0, no_show: 0, cancelled: 0
        });
        return ok(res, { ...stats, reachedMeeting: reached });
    } catch (e) {
        return bad(res, e.message);
    }
};
