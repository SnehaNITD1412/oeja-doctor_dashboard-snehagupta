const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.signAccessToken = (user) => {
    return jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

exports.hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};
