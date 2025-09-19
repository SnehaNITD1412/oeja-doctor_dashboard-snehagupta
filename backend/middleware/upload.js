// File: middleware/upload.js
const multer = require('multer');
const path = require('path');

// Storage engine set karein (kahan aur kaise file save hogi)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        // Ek unique filename banayein: userID-fieldName-timestamp.extension
        cb(null, `${req.user.id}-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File type check karein (sirf images aur pdf allow karein)
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Sirf Images (jpeg, png) ya PDF hi upload kar sakte hain!');
    }
}

// --- YEH SABSE BADA CHANGE HAI ---
// Pehle hum .single() use kar rahe the, ab hum .fields() use karenge
// taaki hum multiple, alag-alag file fields ko handle kar sakein.
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Har file ke liye 5MB limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'regCertificate', maxCount: 1 },
    { name: 'degreeCertificate', maxCount: 1 }
]);

module.exports = upload;
