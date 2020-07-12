const express = require('express');
const router = express.Router();
const { addProduct, addProductCategory } = require('../controllers/productController');
const { verifyToken ,isAdmin } = require('../middlewares/verifyAuth');


router.post('/product-category', verifyToken, isAdmin, addProductCategory);

router.post('/product', verifyToken, isAdmin, addProduct);

module.exports = router;