const express = require('express');
const router = express.Router();
const { addProduct, addProductCategory, getProductPerPage, getProductById } = require('../controllers/productController');
const { verifyToken ,isAdmin } = require('../middlewares/verifyAuth');


router.post('/product-category', verifyToken, isAdmin, addProductCategory);

router.post('/product', verifyToken, isAdmin, addProduct);
router.get('/product/page/:page', getProductPerPage);
router.get('/product/:id', getProductById);

module.exports = router;