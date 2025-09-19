// File: controllers/reports.controller.js
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Report = require('../models/Report');
const { sendEmail } = require('../utils/email');
const emailTemplates = require('../utils/emailTemplates');

const ok = (res, data) => res.status(200).json({ success: true, data });
const bad = (res, error) => res.status(400).json({ success: false, error });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const patientId = req.body.patientId;
        const dir = path.join(__dirname, '..', 'uploads', 'reports', patientId || 'unknown');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
        cb(null, base);
    }
});

// Accept multiple files under field name "files"
exports.upload = multer({ storage }).array('files', 10);

exports.createReport = async (req, res) => {
    try {
        const { patientId } = req.body;
        if (!patientId) return bad(res, 'patientId is required');

        // Support two shapes:
        // 1) Single report: title,type,notes + files[]
        // 2) Multiple reports: items = JSON.stringify([{title,type,notes}, ...]) + files[] (aligned by index)

        function toPublicUrl(absPath) {
            const uploadsIndex = absPath.indexOf(path.join('uploads'));
            if (uploadsIndex !== -1) return '/' + absPath.slice(uploadsIndex).replace(/\\/g, '/');
            return '/uploads/reports/' + path.basename(absPath);
        }

        const uploaded = Array.isArray(req.files) ? req.files.map(f => toPublicUrl(f.path)) : [];

        let created;
        if (req.body.items) {
            // Multiple named reports
            let items = req.body.items;
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch (e) { return bad(res, 'items must be valid JSON'); }
            }
            if (!Array.isArray(items) || items.length === 0) return bad(res, 'items must be a non-empty array');
            // Align each item with corresponding file by index
            created = await Report.insertMany(items.map((it, idx) => ({
                patientId,
                title: it.title,
                type: it.type || 'report',
                notes: it.notes,
                files: uploaded[idx] ? [uploaded[idx]] : []
            })));
        } else {
            const { title, type, notes } = req.body;
            if (!title || !type) return bad(res, 'title and type are required');
            created = await Report.create({ patientId, title, type, notes, files: uploaded });
        }
        
        // Send email notification to patient (if email available)
        // Log the upload
        console.log('New report(s) uploaded for patient:', patientId, 'count:', Array.isArray(created) ? created.length : 1);

        // TODO: Send patient notification if email known. Make sendEmail non-fatal.
        (async () => {
            try {
                // If you implement fetching patient email, call sendEmail here.
                // await sendEmail({ to: patientEmail, subject: 'New Medical Report Available', html: emailTemplates.newReport(doc, patientName) });
            } catch (emailError) {
                console.error('Email sending failed (non-fatal):', emailError);
            }
        })();
        
        return ok(res, created);
    } catch (e) {
        return bad(res, e.message);
    }
};

// List reports for a patient (used by Patient Hub)
exports.list = async (req, res) => {
    try {
        const { patientId } = req.query;
        if (!patientId) return bad(res, 'patientId is required');
        const items = await Report.find({ patientId }).sort({ createdAt: -1 });
        return ok(res, items);
    } catch (e) {
        return bad(res, e.message);
    }
};
