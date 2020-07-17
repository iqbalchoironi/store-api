const express = require('express');
const router = express.Router();
const { addProductRiview, productCategoryList,suggestionSearchProduct,searchProduct,addProduct, addProductCategory, getProductPerPage, getProductById } = require('../controllers/productController');
const { verifyToken ,isAdmin } = require('../middlewares/verifyAuth');



router.post('/product', verifyToken, isAdmin, addProduct);
router.post('/product/category', verifyToken, isAdmin, addProductCategory);
router.post('/product/review', verifyToken, addProductRiview);
router.get('/product/category', verifyToken, isAdmin, productCategoryList);
router.get('/product/page/:page', getProductPerPage);
router.get('/product/search', searchProduct);
router.get('/product/suggestion/:key', suggestionSearchProduct);
router.get('/product/:id', getProductById);


module.exports = router;