import express from 'express';
const router = express.Router();
import {
    getProductById,
    getProducts
} from '../controllers/productController.js'

// router.route.get('/', getProducts).post('/:id', getProductById);
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);


export default router;