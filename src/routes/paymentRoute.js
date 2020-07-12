const express = require('express');
const router = express.Router();
const { addPaymentMethod } = require('../controllers/paymentController');
const { verifyToken, isAdmin } = require('../middlewares/verifyAuth');

router.post('/payment/method', verifyToken, isAdmin, addPaymentMethod);

module.exports = router;
