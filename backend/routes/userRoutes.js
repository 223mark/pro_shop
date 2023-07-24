import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';


import {
    updateUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUserProfile,
    getUserProfile,
    logoutUser,
    registerUser,
    authUser
} from '../controllers/userController.js'

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/logout', protect, logoutUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)


export default router;