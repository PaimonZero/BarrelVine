const router = require('express').Router();
const ctrlsUser = require('@controllers/admin/userAdmin');

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

// ______ User Management Routes ______
// Route to view users
router.get('/users', ctrlsUser.renderUsersPage);
// Route to create user
router.post('/user-create', ctrlsUser.createUser);
// Route to update user
router.post('/user-update', ctrlsUser.updateUserInAdminPage);

module.exports = router;
