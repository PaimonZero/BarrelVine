const router = require('express').Router();
const ctrls = require('@controllers/userController');
const tokenUtils = require('@middlewares/jwt');

// [POST] add user
router.post('/register', ctrls.register);
// [POST] login user
router.post('/login', ctrls.login);
// [GET] get user info  {chạy hàm verifyAccessToken trước khi chạy hàm getCurrentUser}
router.get('/current', tokenUtils.verifyAccessToken, ctrls.getCurrentUser);
// [POST] refresh access token
router.post('/refreshtoken', ctrls.refreshAccessToken);
// [POST] logout user
router.post('/logout', tokenUtils.verifyAccessToken, ctrls.logout);
// [GET] forgot password
router.get('/forgot-password', ctrls.forgotPassword);
// [PUT] reset password
router.put('/reset-password', ctrls.resetPassword);

module.exports = router;

// CRUD | Create, Read, Update, Delete | POST, GET, PUT, DELETE
// Create(POST) + Update(PUT) | body
// Read(GET) + Delete(DELETE) | params, query  ||   params: /user/:id, query: /user?id=1
