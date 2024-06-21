const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.token_generated;


    if (!token) {
        return res.status(401).json({ 
            message: 'No token provided' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Failed to authenticate token' 
            });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;