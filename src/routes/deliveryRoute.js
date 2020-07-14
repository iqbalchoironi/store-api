const express = require('express');
const router = express.Router();
const { addDeliveryMethod,getDeliveryMethodList } = require('../controllers/deliveryController');
const { verifyToken, isAdmin } = require('../middlewares/verifyAuth');

router.post('/delivery/method', verifyToken, isAdmin, addDeliveryMethod);
router.get('/delivery/method', getDeliveryMethodList);

module.exports = router;
