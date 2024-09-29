const chai = require('chai');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');
const Payment = require('../models/payment');
const paymentService = require('../services/paymentService');

const { expect } = chai;

describe('Payment Service', () => {
  afterEach(() => {
    sinon.restore();  // Ensure that all stubs are restored after each test
  });

  describe('initiatePayment', () => {
    it('should create a new payment with valid data', async () => {
      const paymentData = { userId: '12345', amount: 100, paymentMethod: 'credit_card' };
      
      const paymentStub = sinon.stub(Payment.prototype, 'save').resolves(paymentData);
      const payment = await paymentService.initiatePayment(paymentData.userId, paymentData.amount, paymentData.paymentMethod);
      
      expect(paymentStub.calledOnce).to.be.true;
      expect(payment.userId).to.equal(paymentData.userId);
      expect(payment.amount).to.equal(paymentData.amount);
      expect(payment.paymentMethod).to.equal(paymentData.paymentMethod);
    });

    it('should throw an error if payment creation fails', async () => {
      const paymentStub = sinon.stub(Payment.prototype, 'save').rejects(new Error('Payment creation failed'));
      
      try {
        await paymentService.initiatePayment('12345', 100, 'credit_card');
      } catch (error) {
        expect(error.message).to.equal('Payment creation failed');
      }
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status successfully', async () => {
      const transactionId = 'txn_123';
      const status = 'completed';
      const payment = { transactionId, status: 'pending', save: sinon.stub().resolvesThis() };

      const findOneStub = sinon.stub(Payment, 'findOne').resolves(payment);
      
      const updatedPayment = await paymentService.updatePaymentStatus(transactionId, status);
      
      expect(findOneStub.calledOnce).to.be.true;
      expect(updatedPayment.status).to.equal('completed');
    });

    it('should throw an error if payment is not found', async () => {
      const findOneStub = sinon.stub(Payment, 'findOne').resolves(null);

      try {
        await paymentService.updatePaymentStatus('txn_123', 'completed');
      } catch (error) {
        expect(findOneStub.calledOnce).to.be.true;
        expect(error.message).to.equal('Payment not found');
      }
    });
  });
});
