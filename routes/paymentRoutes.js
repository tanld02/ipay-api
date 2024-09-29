const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

router.post('/create', paymentController.createPayment);
router.post('/callback', paymentController.handlePaymentCallback);

module.exports = router;