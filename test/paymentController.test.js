const chai = require('chai');
const sinon = require('sinon');
const paymentService = require('../services/paymentService');
const paymentController = require('../controllers/paymentController');

const { expect } = chai;

describe('Payment Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('createPayment', () => {
    it('should return 201 and the payment data on success', async () => {
      const req = { body: { userId: '12345', amount: 100, paymentMethod: 'credit_card' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      const paymentData = { userId: '12345', amount: 100, paymentMethod: 'credit_card' };
      sinon.stub(paymentService, 'initiatePayment').resolves(paymentData);

      await paymentController.createPayment(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(paymentData)).to.be.true;
    });

    it('should return 500 if payment initiation fails', async () => {
      const req = { body: { userId: '12345', amount: 100, paymentMethod: 'credit_card' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      sinon.stub(paymentService, 'initiatePayment').rejects(new Error('Payment initiation failed'));

      await paymentController.createPayment(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Payment initiation failed', error: 'Payment initiation failed' })).to.be.true;
    });
  });

  describe('handlePaymentCallback', () => {
    it('should return 200 and update the payment status successfully', async () => {
      const req = { body: { transactionId: 'txn_123', status: 'completed' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      const updatedPayment = { transactionId: 'txn_123', status: 'completed' };
      sinon.stub(paymentService, 'updatePaymentStatus').resolves(updatedPayment);

      await paymentController.handlePaymentCallback(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedPayment)).to.be.true;
    });

    it('should return 500 if payment status update fails', async () => {
      const req = { body: { transactionId: 'txn_123', status: 'completed' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      sinon.stub(paymentService, 'updatePaymentStatus').rejects(new Error('Payment status update failed'));

      await paymentController.handlePaymentCallback(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Payment status update failed', error: 'Payment status update failed' })).to.be.true;
    });
  });
});
