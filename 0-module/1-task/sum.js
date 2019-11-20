function sum(a, b) {
  /* ваш код */
  if (!(typeof a === 'number' && typeof a === 'number')) {
  	throw new TypeError
  }

  return a + b
}

module.exports = sum;
