const crypto = require('crypto');

function generateOtpDigits(length = 6) {
  const max = 10 ** length;
  const n = crypto.randomInt(0, max);
  return String(n).padStart(length, '0');
}

module.exports = { generateOtpDigits };
