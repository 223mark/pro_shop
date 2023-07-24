import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Route Protect Middleware
 const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Read 'jwt' from the cookie
    token = req.cookies.jwt;

    if (token) {
       
        try {
           
           let decoded = jwt.verify(token, process.env.JWT_SECRET);
           
        // .select('-password') means we leave psw we don't want it
            req.user = await User.findById(decoded.userId).select('-password');           
            /*
            * this req.user will pass all of our protected routes
            */
            next();
       } catch (error) {
            res.status(401);
            throw new Error('Not authorize, token failed');
       }


    } else {
        res.status(401);
        throw new Error("Not authorize, no token!")
    }
})

// Admin Middleware
 const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401);
        throw new Error('Not authorize, no token!')
    }
}

export { protect, admin };