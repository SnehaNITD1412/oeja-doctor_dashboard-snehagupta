const Appointment = require('../models/Appointment');

exports.getDoctorAppointments = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: 'Authentication error' });
        }
        
        const { status, from, to } = req.query;
        const query = { doctorId: req.user.id };

        if (status) query.status = status;
        if (from && to) query.date = { $gte: new Date(from), $lte: new Date(to) };

        const appointments = await Appointment.find(query)
            .populate('patientId', 'fullName email') // Patient ki details bhi saath mein le aayega
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
        console.log(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};