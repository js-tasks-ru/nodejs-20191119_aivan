function isNumber(n) {
  return typeof n === 'number' && !Number.isNaN(n)
}


function sum(a, b) {
  if (!(isNumber(a) && isNumber(b))) {
  	throw new TypeError
  }

  return a + b
}

module.exports = sum;
