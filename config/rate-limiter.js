const rateLimit = require('express-rate-limit');

const RATE_LIMIT_TIME_IN_MINS = (process.env.RATE_LIMIT_TIME_IN_MINS) ? process.env.RATE_LIMIT_TIME_IN_MINS : 15;
const RATE_LIMIT_MAX_REQ = (process.env.RATE_LIMIT_MAX_REQ) ? process.env.RATE_LIMIT_MAX_REQ : 100;
const RATE_LIMIT_STANDARD_HEADERS = (process.env.RATE_LIMIT_STANDARD_HEADERS) ? process.env.RATE_LIMIT_STANDARD_HEADERS : true;
const RATE_LIMIT_LEGACY_HEADERS = (process.env.RATE_LIMIT_LEGACY_HEADERS) ? process.env.RATE_LIMIT_LEGACY_HEADERS : false;
const RATE_LIMIT_ERROR_MESSAGE = (process.env.RATE_LIMIT_ERROR_MESSAGE) ? process.env.RATE_LIMIT_ERROR_MESSAGE : `Too many requests created from this IP, please try again after ${RATE_LIMIT_TIME_IN_MINS} minutes`;

/**
 * Rate Limiter
 * Defaults Time 15 mins
 *          Limit each IP to 100 requests per `window`
 *          Rate limit info in the `RateLimit-*` headers : false
 *          Disable the `X-RateLimit-*` headers : false
 * @returns rateLimit
 */
const limiter = rateLimit({
    windowMs: RATE_LIMIT_TIME_IN_MINS * 60 * 1000,
    max: RATE_LIMIT_MAX_REQ,
    standardHeaders: RATE_LIMIT_STANDARD_HEADERS,
    legacyHeaders: RATE_LIMIT_LEGACY_HEADERS,
    message: RATE_LIMIT_ERROR_MESSAGE,
})

module.exports = limiter;