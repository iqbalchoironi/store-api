const express = require('express');
const router = express.Router();
const { addPaymentMethod, getPaymentMethodList,getDetailPaymentMethod,getPaymentOrders } = require('../controllers/paymentController');
const { verifyToken, isAdmin } = require('../middlewares/verifyAuth');

router.post('/payment/method', verifyToken, isAdmin, addPaymentMethod);
router.get('/payment/method', getPaymentMethodList);
router.get('/payment/method/:id', getDetailPaymentMethod);
router.get('/payment/orders/:id', getPaymentOrders);

module.exports = router;
