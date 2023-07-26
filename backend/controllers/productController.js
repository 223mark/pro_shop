import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';



// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            // i for case-sensetive
            name: { $regex: req.query.keyword, $options: 'i' }
        }
        : {}
    // we will get filterd data if we have search keyword
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    
    res.json({ products, page, pages: Math.ceil(count/pageSize)});
})


// @desc    Fetch a product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById( req.params.id );
    if (product) {
         res.json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found');

    }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'description'
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.status(200).json(updateProduct);
    }else {
        res.status(404);
        throw new Error("Product not Found");
    }

})


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.status(200).json({message: "Product deleted."})
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
})

// @desc    Create a new reivew
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {

    const { rating, comment } = req.body;
   
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());

        if (alreadReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }
        console.log(req.user);
        
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        // push -> adding a sub array of main data
        product.reviews.push(review);

        product.numReviews = product.reviews.length;
        // factoring new rating to make overall rating
        product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
  
        
        //saving in database
        await product.save();
        res.status(201).json({ message: 'Review added' });

    } else {
        res.status(404);
        throw new Error("Review not found");
    }
})

// @desc    Get top rated  product
// @route   GET /api/products/top
// @access  Public
const getTopProduct = asyncHandler(async (req, res) => {

    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    // const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    
    res.status(200).json(products);
})

export {
    getProductById,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProduct
}