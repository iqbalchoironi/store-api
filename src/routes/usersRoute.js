const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const verifyAuth = require('../middlewares/verifyAuth')

router.post('/auth/signup', userController.userSignUp);
router.post('/auth/signin', userController.userSignIn);

router.post('/user/address', verifyAuth, userController.addAddress);

module.exports = router;