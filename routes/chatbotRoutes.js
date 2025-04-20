const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const paymentController = require('../controllers/paymentController');

router.post('/', chatbotController.handleMessage);
router.get('/payment/callback', paymentController.paymentCallback);

module.exports = router;