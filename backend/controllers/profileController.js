const User = require('../models/User'); 

// Yeh aapka pehle se maujood function hai
exports.completeProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        // ... baaki poora code ...
        res.status(200).json({ 
            success: true,
            message: 'Profile completed successfully!',
            user: updatedUser 
        });
    } catch (error) {
        // ... error handling ...
    }
};

// --- YEH NAYA FUNCTION ADD KAREIN ---
exports.getProfileController = async (req, res) => {
    try {
        // requireAuth middleware se humein user ki id mil jaati hai (req.user.id)
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // User ka data wapas bhejenge
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};