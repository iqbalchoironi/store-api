const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.post('/auth/signup', userController.userSignUp);
router.post('/auth/signin', userController.userSignIn);

module.exports = router;