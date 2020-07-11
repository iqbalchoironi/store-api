const express = require('express');
const router = express.Router();
const verifyAuth = require('../middlewares/verifyAuth');
const ordersController = require('../controllers/ordersController');

router.post('/orders', verifyAuth, ordersController.makeOrders);
router.delete('/orders', verifyAuth, ordersController.cancelOrders);

module.exports = router;