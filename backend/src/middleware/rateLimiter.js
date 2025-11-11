const rateLimit = require('express-rate-limit');

// General API rate limiter - 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for public user endpoints - 30 requests per 15 minutes
const userPublicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: '用户信息请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints - 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: '登录/注册请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  userPublicLimiter,
  authLimiter
};
