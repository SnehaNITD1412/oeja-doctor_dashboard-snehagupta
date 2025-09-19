const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const profileUpload = multer({
  storage: storage,
  limits:{fileSize: 5000000}, // 5 MB
}).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'regCertificate', maxCount: 1 },
    { name: 'degreeCertificate', maxCount: 1 }
]);

// Sunishchit karein ki yeh export line maujood hai
module.exports = { profileUpload };