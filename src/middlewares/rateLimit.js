const rateLimit = require('express-rate-limit');
const SlowDown = require('express-slow-down');

const max = 100;
const windowMs = 10 * 60 * 1000;
const limiter = rateLimit({
  windowMs,
  max,
  message: `You have exceeded the ${max} requests in ${windowMs} limit!`,
});

const speedLimiter = SlowDown({
  windowMs: 30 * 1000,
  delayAfter: 5,
  delayMs: 500,
});

module.exports = { limiter, speedLimiter };
