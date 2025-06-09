const Product = require('@models/Product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// [POST] create product
// [], {} là truthy trong JavaScript → ![] và !{} đều là false => Ko thể dùng ! để kiểm tra rỗng
const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Product data is required!');
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    const newProduct = await Product.create(req.body);
    return res.status(201).json({
        success: newProduct ? true : false,
        product: newProduct ? newProduct : 'Product creation failed!',
    });
});

// [GET] Get product by ID
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid); // .populate('category', 'name')
    return res.status(201).json({
        success: product ? true : false,
        productData: product ? product : 'Product not found!',
    });
});

// [GET] Get all products
// Filter, sort, pagination can be added later
const getProducts = asyncHandler(async (req, res) => {
    const product = await Product.find(); // .populate('category', 'name')
    return res.status(201).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get products!',
    });
});

// [PUT] Update product by ID (admin only)
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Product data is required!');
    // Tạo slug nếu có title mới
    if (req.body.title) {
        req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    const updated = await Product.findByIdAndUpdate(pid, req.body, {
        new: true,
        runValidators: true,
    });
    return res.status(200).json({
        success: updated ? true : false,
        productData: updated || 'Cannot update product!',
    });
});

// [DELETE] Delete product by ID (admin only)
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const deleted = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deleted ? true : false,
        mes: deleted ? `Product "${deleted.title}" was deleted!` : 'Cannot delete product!',
    });
});

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
};
