const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.currentDataSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.currentDataSize += chunk.length;

    if (this.currentDataSize > this.limit) {
      callback(new LimitExceededError());
    } else {
      this.push(chunk);
      callback(null);
    }
  }
}

module.exports = LimitSizeStream;
