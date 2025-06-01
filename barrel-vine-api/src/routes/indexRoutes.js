const userRouter = require("@routes/userRoutes");
const { notFound, errorHandler } = require("@middlewares/errorHandler");

const initRoutes = (app) => {
    // page register
    app.use("/api/user", userRouter);

    // handle 404 - This should be the last route
    app.use(notFound);
    app.use(errorHandler);
};

module.exports = initRoutes;
