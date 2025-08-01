const userRouter = require('@routes/userRoutes');
const productRouter = require('@routes/productRoutes');
const categoryRouter = require('@routes/categoryRoutes');
const couponRouter = require('@routes/couponRoutes');
const invoiceRouter = require('@routes/invoiceRoutes');
const adminRouter = require('@routes/adminRoutes');

const customerHomePageRouter = require('@routes/customer/homePageRoutes');
const customerAccountSettingRouter = require('@routes/customer/accountSettingRoutes');
const customerDashboardRouter = require('@routes/customer/customerDashboardRoutes');
const customerProductDetailRouter = require('@routes/customer/productDetailRoutes');
const customerCategoryRouter = require('@routes/customer/categoryRoutes');
const customerShoppingCartRouter = require('@routes/customer/shoppingCartRoutes');
const customerCheckOutRouter = require('@routes/customer/checkOutRoutes');
const customerOrderHistoryRouter = require('@routes/customer/orderHistoryRoutes');
const customerContactRouter = require('@routes/customer/contactRoutes');
const customerOrderDetailRouter = require('@routes/customer/orderDetailRoutes');

const authRouter = require('@routes/authRoutes');
const { notFound, errorHandler } = require('@middlewares/errorHandler');
const tokenUtils = require('@middlewares/jwt');

const initRoutes = (app) => {
    // page user
    app.use('/api/user', userRouter);
    // page product
    app.use('/api/product', productRouter);
    // page category
    app.use('/api/category', categoryRouter);
    //page coupon
    app.use('/api/coupon', couponRouter);
    // page invoice
    app.use('/api/invoice', invoiceRouter);
    // page admin
    app.use('/admin', [tokenUtils.verifyAccessToken, tokenUtils.isAdmin], adminRouter);
    // page auth
    app.use('/auth', authRouter);

    // page UI
    app.use(tokenUtils.verifyLogedin);

    app.use('/',tokenUtils.verifyLogedin, customerHomePageRouter);
    app.use('/product', customerProductDetailRouter);
    app.use('/customer-dashboard', customerDashboardRouter);
    app.use('/account-setting', customerAccountSettingRouter);
    app.use('/category', customerCategoryRouter);
    app.use('/shopping-cart', customerShoppingCartRouter);
    app.use('/check-out', customerCheckOutRouter);
    app.use('/order-history', customerOrderHistoryRouter);
    app.use('/contact', customerContactRouter);
    app.use('/order-detail', customerOrderDetailRouter);

    // handle 404 - This should be the last route
    app.use(notFound);
    app.use(errorHandler);
};

module.exports = initRoutes;
