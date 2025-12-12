import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            message: "You do not have permission to access this resource."
        });
    }

    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
             return res.status(401).json({
                message: "User belonging to this token no longer exists."
            });
        }

        const { password, ...userData } = user;
        req.user = userData;

        next();

    } catch (err) {
        console.error("Auth Error:", err);
        res.status(401).json({
            message: "Request is unauthorized. Invalid token."
        });
    }
};


export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role ${req.user.role} is not authorized to access this route` 
            });
        }
        next();
    };
};