const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator'); // <-- THIS IS THE FIX. It should be 'require', not 'a'.

// Sub-schema for practice locations (define this BEFORE the main userSchema)
const PracticeLocationSchema = new mongoose.Schema({
    clinicName: { type: String, required: true },
    clinicAddress: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    // --- BASIC AUTH FIELDS ---
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false, // Hides password from default queries
    },
    role: {
        type: String,
        enum: ['doctor', 'patient'],
        default: 'doctor',
    },
    
    // --- PROFILE COMPLETION FIELDS ---
    gender: { type: String },
    dob: { type: Date },
    contactNumber: { type: String },
    medicalRegNumber: { type: String },
    qualification: { type: String },
    specialization: { type: String },
    experience: { type: Number },
    practiceLocations: [PracticeLocationSchema], // Array of locations
    onlineStartTime: { type: String },
    onlineEndTime: { type: String },
    
    // --- FILE UPLOAD URLS ---
    profilePhoto: { type: String },
    idProof: { type: String },
    regCertificate: { type: String },
    degreeCertificate: { type: String },
    
    // --- STATUS AND VERIFICATION FIELDS ---
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,

}, { timestamps: true });


// --- MONGOOSE MIDDLEWARE & METHODS ---

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createEmailVerificationToken = function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
    this.verificationTokenExpiry = Date.now() + 10 * 60 * 1000;
    return token;
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);