import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';



// @desc   Auth user & get token
// @route  POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // generate token
        generateToken(res, user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
})


// @desc   Register user & get token
// @route  POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})

// @desc   Logout user & clear cookie
// @route  POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {

    // clear cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: "Logged out successfully.." });
})

// @desc   Get user profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {

    // this user._id comes from protected middleware
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(400);
        throw new Error("User not found");
    }
})

// @desc   Update  user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
     // this user._id comes from protected middleware
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password
        }

        // save is what we use when we update document
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(400);
        throw new Error("User not found");
    }
})

// @desc   Get users
// @route  GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    res.send("get users");
})

// @desc   Get user by Id
// @route  GET /api/user/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    res.send("get user byid");
})

// @desc   Delete user
// @route  DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    res.send("delete users");
})


// @desc   Update user by Admin
// @route  PUT /api/users/:Id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    res.send("update users");
})


export {
    updateUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUserProfile,
    getUserProfile,
    logoutUser,
    registerUser,
    authUser

}