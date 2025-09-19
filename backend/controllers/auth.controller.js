const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const { signAccessToken, hashToken } = require('../utils/tokens');
const validator = require('validator'); // <-- THE FIX IS HERE (was 'a')

// Handles new user registration
exports.register = async (req, res) => {
    // --- CHANGE 2: Using fullName instead of firstName, lastName ---
    const { fullName, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Passwords do not match.' });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
        }

        // --- CHANGE 3: Passing fullName to the new User object ---
        const user = new User({ fullName, email, password });
        const verificationToken = user.createEmailVerificationToken();
        await user.save();

        // Standard verification email
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}&email=${email}`;
        const emailHTML = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome, ${user.fullName}!</h2>
                <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                <p style="text-align: center;">
                    <a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
                </p>
                <p>Thank you!</p>
            </div>
        `;
        
        await sendEmail({
            to: email,
            subject: 'Registration Successful - Please Verify Your Email',
            html: emailHTML
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email to verify your account.'
        });

    } catch (error) {
        console.error("REGISTRATION_ERROR:", error);
        res.status(500).json({ success: false, error: 'An internal server error occurred.' });
    }
};

// --- Baaki saare functions waise ke waise hi rahenge ---
// Handles user login with EMAIL
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        if (!user.isVerified) {
            return res.status(401).json({ success: false, error: 'Please verify your email before logging in.' });
        }

        const token = signAccessToken(user);
        res.status(200).json({
            success: true,
            token: token,
            user: {
                id: user._id,
                isProfileComplete: user.isProfileComplete
            }
        });
    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        res.status(500).json({ success: false, error: 'An internal server error occurred.' });
    }
};

// Handles email verification
exports.verifyEmail = async (req, res) => {
    const { token, email } = req.query;
    try {
        const hashedToken = hashToken(token);
        const user = await User.findOne({ email, verificationToken: hashedToken, verificationTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error during email verification.' });
    }
};

// --- Other functions ---
exports.forgotPassword = async (req, res) => {
    res.status(501).json({ error: 'Not yet implemented.' });
};
exports.resetPassword = async (req, res) => {
    res.status(501).json({ error: 'Not yet implemented.' });
};
exports.changePassword = async (req, res) => {
    res.status(501).json({ error: 'Not yet implemented.' });
};
exports.healthCheck = (req, res) => {
    res.status(200).json({ status: 'ok' });
};