const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyAuth = require('../middlewares/verifyAuth');

router.post('/cart/add-product', verifyAuth, cartController.addProductToCart);

module.exports = router;