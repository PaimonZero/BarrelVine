const userRouter = require('@routes/userRoutes');
const productRouter = require('@routes/productRoutes');
const categoryRouter = require('@routes/categoryRoutes');
const couponRouter = require('@routes/couponRoutes');
const invoiceRouter = require('@routes/invoiceRoutes');

const customerHomePageRouter = require('@routes/customer/homePageRoutes');
const customerDashboardRouter = require('@routes/customer/customerDashboardRoutes');
const customerAccountSettingRouter = require('@routes/customer/accountSettingRoutes');

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
    // page auth
    app.use('/auth', authRouter);

    // page UI
    app.use('/', customerHomePageRouter);
    app.use('/customer-dashboard', customerDashboardRouter);
    app.use('/account-setting', customerAccountSettingRouter);

    // handle 404 - This should be the last route
    app.use(notFound);
    app.use(errorHandler);
};

module.exports = initRoutes;
