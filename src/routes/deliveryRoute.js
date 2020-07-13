const express = require('express');
const router = express.Router();
const { addDeliveryMethod,getDeliveryMethod } = require('../controllers/deliveryController');
const { verifyToken, isAdmin } = require('../middlewares/verifyAuth');

router.post('/delivery/method', verifyToken, isAdmin, addDeliveryMethod);
router.get('/delivery/method', getDeliveryMethod);

module.exports = router;
