import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_TAX_RATE,
  NETWORKS,
  calculateLoadToBalance,
  calculateRequiredLoad,
  formatPkr,
  sanitizeAmount,
  sanitizeRate,
} from './calculator';

test('calculateLoadToBalance computes 13.04% standard Pakistan telecom tax accurately', () => {
  const res = calculateLoadToBalance(320, DEFAULT_TAX_RATE);
  assert.equal(res.rechargeAmount, 320);
  assert.equal(res.taxAmount, 41.73);
  assert.equal(res.netBalance, 278.27);
  assert.equal(res.retentionPercent, 86.96);
});

test('calculateLoadToBalance handles 0 and negative inputs safely', () => {
  const zero = calculateLoadToBalance(0, 13.04);
  assert.equal(zero.netBalance, 0);
  assert.equal(zero.taxAmount, 0);

  const neg = calculateLoadToBalance(-500, 13.04);
  assert.equal(neg.rechargeAmount, 0);
  assert.equal(neg.netBalance, 0);
});

test('calculateRequiredLoad rounds up to nearest rupee so net balance never falls short', () => {
  const res = calculateRequiredLoad(270, DEFAULT_TAX_RATE);
  assert.equal(res.targetBalance, 270);
  // 270 / 0.8696 = 310.48758 -> ceil is 311
  assert.equal(res.recommendedLoad, 311);
  assert.ok(res.actualNetReceived >= 270);
  assert.equal(res.actualNetReceived, 270.45);
  assert.equal(res.bufferAmount, 0.45);
});

test('calculateRequiredLoad handles zero target and zero tax rate', () => {
  const zeroTarget = calculateRequiredLoad(0, 13.04);
  assert.equal(zeroTarget.recommendedLoad, 0);
  assert.equal(zeroTarget.actualNetReceived, 0);

  const zeroTax = calculateRequiredLoad(500, 0);
  assert.equal(zeroTax.recommendedLoad, 500);
  assert.equal(zeroTax.actualNetReceived, 500);
  assert.equal(zeroTax.actualTaxDeducted, 0);
});

test('sanitizeAmount and sanitizeRate clamp invalid inputs', () => {
  assert.equal(sanitizeAmount('abc'), 0);
  assert.equal(sanitizeAmount(-10), 0);
  assert.equal(sanitizeAmount('250.5'), 250.5);

  assert.equal(sanitizeRate(-5), 0);
  assert.equal(sanitizeRate(150), 99);
  assert.equal(sanitizeRate('13.04'), 13.04);
});

test('formatPkr formats currency consistently', () => {
  assert.equal(formatPkr(278.27), 'Rs. 278.27');
  assert.equal(formatPkr(1000, 0), 'Rs. 1,000');
});

test('all four Pakistani mobile networks have USSD codes and package presets', () => {
  const carrierIds = ['jazz', 'zong', 'telenor', 'ufone'];
  for (const id of carrierIds) {
    const net = NETWORKS.find((n) => n.id === id);
    assert.ok(net, `Missing network ${id}`);
    assert.ok(net.ussdCodes.length >= 3, `Expected USSD codes for ${id}`);
    assert.ok(net.packages.length >= 2, `Expected package presets for ${id}`);
  }
});
