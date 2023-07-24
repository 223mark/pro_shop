import jwt from 'jsonwebtoken';


const generateToken = (res, userId) => {
    const token = jwt.sign({ userId}, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Set JWT as HTTP-ONLY cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            // to use secure u need to have https://
            secure: process.env.NODE_ENV !== 'development',
            // preventing strict attack
            sameSite: 'strict',
            // 30 is milisec and it is 30days
            maxAge: 30 * 24* 60 * 60 * 1000
            
        })
}

export default generateToken;