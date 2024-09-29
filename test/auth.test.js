const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

const { expect } = chai;

describe('Auth Middleware', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should call next() if token is valid', () => {
    const req = { headers: { authorization: 'Bearer valid-token' } };
    const res = {};
    const next = sinon.stub();

    sinon.stub(jwt, 'verify').returns({ userId: '12345' });

    authMiddleware(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(req.user).to.eql({ userId: '12345' });
  });

  it('should return 401 if token is not provided', () => {
    const req = { headers: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Access denied, no token provided' })).to.be.true;
  });

  it('should return 400 if token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

    authMiddleware(req, res, next);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Invalid token' })).to.be.true;
  });
});
