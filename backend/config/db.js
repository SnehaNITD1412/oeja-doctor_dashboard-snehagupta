const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const conn = mongoose.connection;
        if (process.env.DEBUG_DB === 'true' || process.env.NODE_ENV !== 'production') {
            console.log('MongoDB connected to', conn.host, 'db:', conn.name);
        }

        // Cleanup: drop legacy unique index on doctorId (field removed from User schema)
        try {
            const usersCol = conn.db.collection('users');
            const idx = await usersCol.indexExists('doctorId_1');
            if (idx) {
                await usersCol.dropIndex('doctorId_1');
                console.log('Removed legacy index doctorId_1 from users collection');
            }
        } catch (idxErr) {
            // Non-fatal; continue startup
            if (process.env.DEBUG_DB === 'true' || process.env.NODE_ENV !== 'production') {
                console.warn('Index cleanup skipped:', idxErr.message);
            }
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
