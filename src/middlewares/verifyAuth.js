const jwt = require('jsonwebtoken');
const {status, errorMessage} = require('../helpers/payload');

const verifyToken = async (req, res, next) => {
    const { token } = req.header;
    if( !token ) {
        errorMessage.message = 'Token not provided';
        return res.status(status.bad).send(errorMessage);
    }
    
    try {
        const decode = jwt.verify(token, process.env.SECRET);
        req.user = {
            id: decode.user_id,
            first_name: decode.first_name,
            last_name: decode.last_name,
            email: decode.email,
            telephone: decode.telephone,
            role: decode.role,
            verified: decode.verified
        };
        next();
    } catch (error) {
        errorMessage.message = 'Authentication Failed';
        return res.status(status.unauthorized).send(errorMessage);
    }
}

module.exports = verifyToken;