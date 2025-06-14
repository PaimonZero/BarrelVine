const router = require('express').Router();
const ctrls = require('@controllers/productController');
const tokenUtils = require('@middlewares/jwt');

// [POST] Create a new product
router.post('/', [tokenUtils.verifyAccessToken, tokenUtils.isAdmin], ctrls.createProduct);
// [GET] Get all products
router.get('/', ctrls.getProducts);
// [PUT] Update/ Create new ratings for a product
router.put('/', tokenUtils.verifyAccessToken, ctrls.ratings);
// [GET] Get a product by ID
router.get('/:pid', ctrls.getProduct);
// [PUT] Update a product by ID (admin only)
router.put('/:pid', [tokenUtils.verifyAccessToken, tokenUtils.isAdmin], ctrls.updateProduct);
// [DELETE] Delete a product by ID (admin only)
router.delete('/:pid', [tokenUtils.verifyAccessToken, tokenUtils.isAdmin], ctrls.deleteProduct);

module.exports = router;
