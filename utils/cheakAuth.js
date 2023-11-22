import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

export default (req, res, next) => {
    dotenv.config();
    const API_KEY = process.env.API_KEY
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded = jwt.verify(token, API_KEY)
            req.userId = decoded._id;
            next();
        }
        catch (err) {
            return res.status(403).json({
                message: ' Немає доступу'
            });
        }
    } else {
        return res.status(403).json({
            message: ' Немає доступу'
        });
    }

}