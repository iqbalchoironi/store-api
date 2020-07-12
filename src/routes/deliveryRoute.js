const express = require('express');
const router = express.Router();
const { addDeliveryMethod } = require('../controllers/deliveryController');
const { verifyToken, isAdmin } = require('../middlewares/verifyAuth');

router.post('/delivery/method', verifyToken, isAdmin, addDeliveryMethod);

module.exports = router;
