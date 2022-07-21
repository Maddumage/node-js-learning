const express = require('express');

const authController = require('../../controllers/authController');

const router = express.Router();

router.post('/register', authController.createNewUser);

router.post('/login', authController.findUser);

module.exports = router;
