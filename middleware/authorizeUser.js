const jwt = require('jsonwebtoken');
const {tokenRefiner} = require('../util/tokenRefiner');

exports.authorizeUser = (req, res, next) => {
    const InitialToken = req.headers.authorization;
    const token = tokenRefiner(InitialToken);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decodedToken = jwt.verify(token, 'tempkeyfornow123');
        req.body.userId = decodedToken.id;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}