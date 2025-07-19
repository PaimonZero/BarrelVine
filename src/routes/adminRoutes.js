const router = require('express').Router();
const ctrlsUser = require('@controllers/admin/userAdmin');
const ctrlsDashboard = require('@controllers/admin/dashboardAdmin');
const ctrlsCategory = require('@controllers/admin/categoryAdmin');

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
// ______ Category Management Routes ______
// Route to view categories
router.get('/categories', ctrlsCategory.renderCategoriesPage);
// Route to create category
router.post('/category-create', ctrlsCategory.createCategory);
// Route to update category
router.post('/category-update/:cid', ctrlsCategory.updateCategory);
// Route to delete category
router.post('/category-delete/:cid', ctrlsCategory.deleteCategory);

module.exports = router;
