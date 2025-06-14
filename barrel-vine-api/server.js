const express = require('express');
require('module-alias/register');
const qs = require('qs');
const cookieParser = require('cookie-parser');
const dbConnect = require('@src/config/dbconnect');
const env = require('@src/config/environment');
const initRoutes = require('@src/routes/indexRoutes');

const app = express();
const port = env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Ghi đè query parser mặc định của Express để parse query strings phức tạp
app.set('query parser', (str) => qs.parse(str));

// Database connect
dbConnect();

// Handle routes
initRoutes(app);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});
