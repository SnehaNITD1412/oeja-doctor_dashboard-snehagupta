const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

// Load env variables
dotenv.config();

// Connect to DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
