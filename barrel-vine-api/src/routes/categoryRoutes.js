const router = require('express').Router();
const ctrls = require('@controllers/categoryController')
const tokenUtils = require('@middlewares/jwt');

// [POST] Create new category
router.post('/', [tokenUtils.verifyAccessToken, tokenUtils.isAdmin], ctrls.createCategory);
// [GET] test view ejs
router.get('/test-view', ctrls.testView);

module.exports = router;