const Payment = require('../models/payment');
const paymentService = require('../services/paymentService');

exports.createPayment = async (req, res) => {
  const { userId, amount, paymentMethod } = req.body;
  
  try {
    const payment = await paymentService.initiatePayment(userId, amount, paymentMethod);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

exports.handlePaymentCallback = async (req, res) => {
  const { transactionId, status } = req.body;
  
  try {
    const updatedPayment = await paymentService.updatePaymentStatus(transactionId, status);
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Payment status update failed', error: error.message });
  }
};
