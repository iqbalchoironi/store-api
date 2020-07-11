const express = require('express');
const router = express.Router();
const { addProduct, addProductCategory } = require('../controllers/productController');
const verifyAuth = require('../middlewares/verifyAuth');


router.post('/product-category', verifyAuth, addProductCategory);

router.post('/product', verifyAuth, addProduct);

module.exports = router;