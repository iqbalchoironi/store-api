const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyAuth');
const ordersController = require('../controllers/ordersController');

router.post('/orders', verifyToken, ordersController.makeOrders);
router.delete('/orders', verifyToken, ordersController.cancelOrders);

module.exports = router;