// File: utils/meetLink.js
const crypto = require('crypto');

// Generate a Google Meet-like link
exports.generateGoogleMeetLink = () => {
    const randomId = crypto.randomBytes(3).toString('hex');
    return `https://meet.google.com/${randomId}-${randomId}`;
};

// Generate a Zoom-like link
exports.generateZoomLink = () => {
    const meetingId = Math.floor(Math.random() * 900000000) + 100000000;
    const password = crypto.randomBytes(2).toString('hex');
    return `https://zoom.us/j/${meetingId}?pwd=${password}`;
};

// Generate a custom meet link
exports.generateCustomMeetLink = (appointmentId) => {
    const base = process.env.APP_URL || 'http://localhost:5000';
    const shortId = appointmentId.toString().slice(-6);
    return `${base}/meet/${shortId}`;
};

// Main function to generate meet link
exports.generateMeetLink = (type = 'google', appointmentId = null) => {
    switch (type) {
        case 'google':
            return exports.generateGoogleMeetLink();
        case 'zoom':
            return exports.generateZoomLink();
        case 'custom':
            return exports.generateCustomMeetLink(appointmentId);
        default:
            return exports.generateGoogleMeetLink();
    }
};
