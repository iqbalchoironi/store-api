const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyAuth = require('../middlewares/verifyAuth');

router.post('/cart/product', verifyAuth, cartController.addProductToCart);
router.put('/cart/product', verifyAuth, cartController.updateProductInCart);
router.delete('/cart/product', verifyAuth, cartController.deleteProductInCart);

module.exports = router;