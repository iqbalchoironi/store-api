const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { verifyToken } = require('../middlewares/verifyAuth')

router.post('/auth/signup', userController.userSignUp);
router.post('/auth/signin', userController.userSignIn);

router.post('/user/address', verifyToken, userController.addAddress);
router.get('/user/address', verifyToken, userController.getAddressByUserId);

module.exports = router;