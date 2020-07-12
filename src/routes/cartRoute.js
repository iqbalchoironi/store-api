const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {verifyToken} = require('../middlewares/verifyAuth');

router.post('/cart/product', verifyToken, cartController.addProductToCart);
router.put('/cart/product', verifyToken, cartController.updateProductInCart);
router.delete('/cart/product', verifyToken, cartController.deleteProductInCart);

module.exports = router;