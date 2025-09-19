// File: app.js or server.js (Updated Version)

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require("path");

// --- CHANGE 1: Import the new Message Route file ---
const authRoutes = require('./routes/auth.routes');
const doctorRoutes = require('./routes/doctor.routes');
const profileRoutes = require('./routes/profileRoutes');
const patientHubRoutes = require('./routes/patientHub.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const reportsRoutes = require('./routes/reports.routes');
const prescriptionsRoutes = require('./routes/prescriptions.routes');
const devRoutes = require('./routes/dev.routes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messages'); // <-- ADD THIS LINE

const app = express();

// --- MIDDLEWARES ---

// IMPORTANT: CORS middleware should be one of the first
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); // for mobile apps / curl
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','x-access-token']
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// To serve uploaded files (This is already correct)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Temporary request logger to debug 404 path issues
app.use((req, res, next) => {
    console.log('[REQ]', req.method, req.originalUrl);
    next();
});

// --- API ROUTES ---

// --- CHANGE 2: Use the new Message Route in the app ---
app.use('/', authRoutes);
app.use('/', doctorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', patientHubRoutes);
// Also mount at root to accept calls without the /api prefix (e.g., /patient-summary/:id)
app.use('/', patientHubRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', reportsRoutes);
app.use('/api', prescriptionsRoutes);
app.use('/api', devRoutes);
app.use('/api', appointmentRoutes);

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/messages', messageRoutes); // <-- AND ADD THIS LINE
// Alias for legacy/frontend path expectations
app.use('/chats', messageRoutes);

// --- ERROR HANDLERS ---
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: 'API Route Not Found' });
});

app.use((err, req, res, next) => {
    console.error("SERVER_ERROR:", err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
});

module.exports = app;