const Payment = require('../models/payment');

exports.initiatePayment = async (userId, amount, paymentMethod) => {
  const transactionId = generateUniqueTransactionId(); // Helper function to generate unique transaction ID

  const payment = new Payment({
    userId,
    amount,
    paymentMethod,
    transactionId,
  });
  
  await payment.save();
  return payment;
};

exports.updatePaymentStatus = async (transactionId, status) => {
  const payment = await Payment.findOne({ transactionId });

  if (!payment) throw new Error('Payment not found');

  payment.status = status;
  await payment.save();
  
  return payment;
};

// Helper function
function generateUniqueTransactionId() {
  return 'txn_' + Date.now() + Math.random().toString(36).substr(2, 9);
}