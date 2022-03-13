import jwt from 'jsonwebtoken';
import env from 'dotenv';

import Users from '../models/Users.js';

env.config();

const isLoginMiddleware = async (req, res, next) => {
    try {        
        const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

        // Verify users is login
        const payload = jwt.verify(token, process.env.JWT_KEY);
        
        const user = await Users.getById(payload.id);

        if (!user) {
            throw new Error();
        }

        // Next to controller
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: 'Please login for access this resources.'
        })
    }
};

export default isLoginMiddleware;