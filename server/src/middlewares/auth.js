const jwt = require('../utils/jwt');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};