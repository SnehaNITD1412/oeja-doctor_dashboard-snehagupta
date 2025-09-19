// File: middleware/checkProfile.js

/**
 * Yeh middleware 'requireAuth' ke BAAD chalta hai. Yeh check karta hai ki
 * agar logged-in user ek 'doctor' hai, to usne apni professional profile
 * complete ki hai ya nahi.
 */
exports.checkProfileCompletion = (req, res, next) => {
    // Poora user object 'requireAuth' middleware se aa raha hai
    const user = req.user;

    // Check karein ki user ek doctor hai aur uski profile incomplete hai
    if (user && user.role === 'doctor' && !user.isProfileComplete) {
        
        // API ke liye, hum ek khaas error response bhejte hain.
        // Frontend is error ko dekh kar samjhega ki use profile form dikhana hai.
        return res.status(403).json({ 
            success: false, 
            error: 'Profile not complete. Please fill in your professional details.',
            errorCode: 'PROFILE_INCOMPLETE' // Frontend ke liye ek khaas code
        });
    }
    
    // Agar profile complete hai, ya user doctor nahi hai, to use aage jaane dein
    next();
};
