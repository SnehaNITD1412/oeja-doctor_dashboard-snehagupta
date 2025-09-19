// File: controllers/patientHub.controller.js

// NOTE: These endpoints now read from real collections to keep Patient Hub in sync

const Report = require('../models/Report');
const Prescription = require('../models/Prescription');
const Message = require('../models/Message');
const Feedback = require('../models/Feedback');
const Appointment = require('../models/Appointment');
const isValidObjectId = (id) => typeof id === 'string' && id.length > 0; // relax for now

const ok = (res, data) => res.status(200).json({ success: true, data });
const bad = (res, msg) => res.status(400).json({ success: false, error: msg });

exports.getPatientSummary = async (req, res) => {
    const { patientId } = req.params;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');

    // Pull core pieces from collections
    const [reports, prescriptions, msgs, appts, fDoc, fPat] = await Promise.all([
        Report.find({ patientId }).sort({ createdAt: -1 }).lean(),
        Prescription.find({ patientId }).sort({ createdAt: -1 }).lean(),
        Message.find({ patientId }).sort({ createdAt: -1 }).lean(),
        Appointment.find({ patientId }).sort({ date: -1, createdAt: -1 }).lean(),
        Feedback.find({ patientId, from: 'doctor' }).sort({ createdAt: -1 }).lean(),
        Feedback.find({ patientId, from: 'patient' }).sort({ createdAt: -1 }).lean()
    ]);

    const completedVisits = appts.filter(a => a.status === 'completed');
    const lastVisit = completedVisits.length > 0 ? completedVisits[0].date : null;
    const nextVisit = appts.filter(a => ['pending','approved'].includes(a.status))
        .sort((a,b) => new Date(a.date) - new Date(b.date))[0] || null;
    const latestRx = prescriptions[0] || null;
    const recentReports = reports.slice(0, 2).map(r => ({ _id: r._id, title: r.title }));

    const summary = {
        id: patientId,
        lastVisit,
        isNew: appts.length === 0
    };

    return ok(res, {
        summary,
        reports,
        prescriptions,
        visits: completedVisits.map(v => ({ _id: v._id, patientId, date: v.date, reason: v.problem })),
        feedbackFromDoctor: fDoc,
        feedbackFromPatient: fPat,
        chats: msgs,
        overview: {
            basic: {
                name: null,
                patientId,
                age: null,
                gender: null,
                lastVisit
            },
            upcoming: nextVisit ? {
                date: nextVisit.date,
                time: nextVisit.startTime,
                status: nextVisit.status
            } : null,
            stats: {
                totalVisits: completedVisits.length,
                reportsCount: reports.length,
                prescriptionsCount: prescriptions.length
            },
            activePrescription: latestRx ? {
                id: latestRx._id,
                medicines: latestRx.medicines,
                advice: latestRx.advice
            } : null,
            recentReports
        }
    });
};

// Minimal patient detail for UI lookups
exports.getPatientById = async (req, res) => {
    const { patientId } = req.params;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
    // Placeholder object; integrate with your real Patient model if available
    return ok(res, { id: patientId });
};

exports.getReports = async (req, res) => {
    const { patientId } = req.query;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
    const items = await Report.find({ patientId }).sort({ createdAt: -1 });
    return ok(res, items);
};

exports.getPrescriptions = async (req, res) => {
    const { patientId } = req.query;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
    const items = await Prescription.find({ patientId }).sort({ createdAt: -1 });
    return ok(res, items);
};

exports.getChats = async (req, res) => {
    const { patientId } = req.query;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
    const items = await Message.find({ patientId }).sort({ createdAt: -1 });
    return ok(res, items);
};

exports.getFeedbackFromDoctor = async (req, res) => {
    const { patientId } = req.query;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
    const items = await Feedback.find({ patientId, from: 'doctor' }).sort({ createdAt: -1 });
    return ok(res, items);
};

exports.getFeedbackFromPatient = async (req, res) => {
    const { patientId } = req.query;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
    const items = await Feedback.find({ patientId, from: 'patient' }).sort({ createdAt: -1 });
    return ok(res, items);
};

exports.getAppointments = async (req, res) => {
    const { patientId, status, from, to } = req.query;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
    const query = { patientId };
    if (status) query.status = status;
    if (from && to) query.date = { $gte: new Date(from), $lte: new Date(to) };
    const items = await Appointment.find(query).sort({ date: -1, createdAt: -1 });
    return ok(res, items);
};

// Minimal visits list (placeholder)
exports.getVisits = async (req, res) => {
    const { patientId } = req.query;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
    const completed = await Appointment.find({ patientId, status: 'completed' }).sort({ date: -1 });
    const visits = completed.map(v => ({ _id: v._id, patientId, date: v.date, reason: v.problem }));
    return ok(res, visits);
};

exports.getAppointmentStats = async (req, res) => {
    const { patientId } = req.query;
    if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
    const byStatus = await Appointment.aggregate([
        { $match: { patientId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const base = { total: 0, upcoming: 0, completed: 0, cancelled: 0, pending: 0, approved: 0, rejected: 0 };
    const stats = byStatus.reduce((acc, s) => { acc.total += s.count; acc[s._id] = s.count; return acc; }, base);
    return ok(res, stats);
};

// --- Create endpoints ---
exports.createReport = async (req, res) => {
    try {
        const { patientId, type, title, description, fileUrl } = req.body;
        if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
        if (!type || !title) return bad(res, 'type and title are required');
        const doc = await Report.create({ patientId, doctorId: req.user._id || req.user.id, type, title, description, fileUrl });
        return ok(res, doc);
    } catch (e) {
        return bad(res, e.message);
    }
};

exports.createPrescription = async (req, res) => {
    try {
        const { patientId, notes, medicines } = req.body;
        if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
        const doc = await Prescription.create({ patientId, doctorId: req.user._id || req.user.id, notes, medicines: medicines || [] });
        return ok(res, doc);
    } catch (e) {
        return bad(res, e.message);
    }
};

exports.createMessage = async (req, res) => {
    try {
        const { patientId, doctorId: doctorIdFromBody, sender: senderFromBody, text, attachments } = req.body;

        // Basic validations
        if (!patientId || !isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
        if (!text || typeof text !== 'string' || text.trim().length === 0) return bad(res, 'text is required');

        // Resolve sender
        let resolvedSender = senderFromBody;
        if (!resolvedSender && req.user && req.user.role) {
            resolvedSender = req.user.role === 'doctor' ? 'doctor' : 'patient';
        }
        if (!['patient', 'doctor'].includes(resolvedSender)) {
            return bad(res, 'sender must be either "patient" or "doctor"');
        }

        // Resolve doctorId
        let resolvedDoctorId = doctorIdFromBody;
        if (!resolvedDoctorId && req.user && req.user.role === 'doctor') {
            resolvedDoctorId = req.user._id || req.user.id;
        }
        if (!resolvedDoctorId) return bad(res, 'doctorId is required');

        const doc = await Message.create({
            patientId,
            doctorId: resolvedDoctorId,
            sender: resolvedSender,
            text: text.trim(),
            attachments: Array.isArray(attachments) ? attachments : []
        });
        return ok(res, doc);
    } catch (e) {
        return bad(res, e.message);
    }
};

exports.createDoctorFeedback = async (req, res) => {
    try {
        const { patientId, rating, comment } = req.body;
        if (!isValidObjectId(patientId)) return bad(res, 'Invalid patientId');
        const doc = await Feedback.create({ patientId, doctorId: req.user._id || req.user.id, from: 'doctor', rating, comment });
        return ok(res, doc);
    } catch (e) {
        return bad(res, e.message);
    }
};

exports.createPatientFeedback = async (req, res) => {
    try {
        const { doctorId, rating, comment } = req.body;
        const patientId = req.body.patientId || (req.user._id || req.user.id);
        const doc = await Feedback.create({ patientId, doctorId, from: 'patient', rating, comment });
        return ok(res, doc);
    } catch (e) {
        return bad(res, e.message);
    }
};


