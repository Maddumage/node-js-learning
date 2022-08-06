const express = require('express');

const userController = require('../../controllers/userController');
const { verifyToken } = require('../../utils/tokenHelper');

const router = express.Router();

router.get('/profile', verifyToken, userController.getUser);

module.exports = router;
