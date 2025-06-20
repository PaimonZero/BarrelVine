const userRouter = require("@routes/userRoutes");
const productRouter = require("@routes/productRoutes");
const categoryRouter = require('@routes/categoryRoutes')
const { notFound, errorHandler } = require("@middlewares/errorHandler");
const tokenUtils = require("@middlewares/jwt");


const initRoutes = (app) => {
    // page user
    app.use("/api/user", userRouter);
    // page product
    app.use('/api/product', productRouter);
    // page category
    app.use('/api/category', categoryRouter);

    // handle 404 - This should be the last route
    app.use(notFound);
    app.use(errorHandler);
};

module.exports = initRoutes;
