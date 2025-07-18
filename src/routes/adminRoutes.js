const router = require('express').Router();
const tokenUtils = require('@middlewares/jwt');
const uploadCloud = require('@config/cloudinary.config');
const ctrlsUser = require('@controllers/admin/userAdmin');
const ctrlsDashboard = require('@controllers/admin/dashboardAdmin');
const ctrlsProduct = require('@controllers/admin/productAdmin');

// test controller
const Product = require('@models/Product');
const Category = require('@models/Category');
const Coupon = require('@models/Coupon');
const Invoice = require('@models/Invoice');
const User = require('@models/User');

// Set default layout for admin routes
router.use((req, res, next) => {
    res.locals.layout = 'layouts/admin';
    next();
});

// Route to dashboard view
router.get('/dashboard', ctrlsDashboard.renderDashboard);

// ______ User Management Routes ______
// Route to view users
router.get('/users', ctrlsUser.renderUsersPage);
// Route to create user
router.post('/user-create', ctrlsUser.createUser);
// Route to update user
router.post('/user-update', ctrlsUser.updateUserInAdminPage);

// ______ Product Management Routes ______
// Route to view products
router.get('/products', ctrlsProduct.renderProductList);
// Route to view create product
router.get('/product-create', ctrlsProduct.renderCreateProductPage);
// Route to create product
router.post('/product-create', uploadCloud.array('images', 10), ctrlsProduct.createProduct);
// Route to view edit product
router.get('/product-update/:pid', ctrlsProduct.renderUpdateProductPage);
// Route to update product
router.post('/product-update/:pid', uploadCloud.array('images', 10), ctrlsProduct.updateProduct);
// Route to delete product
router.post('/product-delete/:pid', ctrlsProduct.deleteProduct);
// Route to delete product image
router.delete('/product-delete-image/:pid', ctrlsProduct.deleteProductImage);

module.exports = router;
