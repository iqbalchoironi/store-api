const express = require('express');
const router = express.Router();
const { addPaymentMethod, getPaymentMethod } = require('../controllers/paymentController');
const { verifyToken, isAdmin } = require('../middlewares/verifyAuth');

router.post('/payment/method', verifyToken, isAdmin, addPaymentMethod);
router.get('/payment/method', getPaymentMethod);

module.exports = router;
