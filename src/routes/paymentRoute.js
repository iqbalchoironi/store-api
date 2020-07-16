const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/fileUpload');
const { verifyToken, isAdmin } = require('../middlewares/verifyAuth');
const { addPaymentAdvidance,
    addPaymentMethod, 
    getPaymentMethodList,
    getDetailPaymentMethod,
    getPaymentOrders, 
    updatePaymentAdvidance 
} = require('../controllers/paymentController');

router.get('/payment/orders/:id', getPaymentOrders);
router.get('/payment/method', getPaymentMethodList);
router.get('/payment/method/:paymentMethodId', getDetailPaymentMethod);
router.post('/payment/method', verifyToken, isAdmin, addPaymentMethod);
router.post('/payment/:paymentId/advidace', verifyToken, upload.single('payment_advidance_image'), addPaymentAdvidance)
router.put('/payment/:paymentId/advidace', verifyToken, upload.single('payment_advidance_image'), updatePaymentAdvidance)


module.exports = router;
