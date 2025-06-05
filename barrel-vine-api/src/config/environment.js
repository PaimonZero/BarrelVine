// environment.js
require('dotenv').config(); // Load biến môi trường từ .env

const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME,
    HOST: process.env.HOST,
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
    EMAIL_NAME: process.env.EMAIL_NAME,
    CLIENT_URL: process.env.CLIENT_URL,
};

module.exports = env;
