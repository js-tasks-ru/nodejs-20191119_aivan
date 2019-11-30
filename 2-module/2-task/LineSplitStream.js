const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.tempChunk = '';
  }

  _transform(chunk, encoding, callback) {
    const str = chunk.toString();

    str.split('').forEach((s) => {
      if (s === os.EOL) {
        this.push(this.tempChunk);
        this.tempChunk = '';
      } else {
        this.tempChunk += s;
      }
    });

    callback(null);
  }

  _flush(callback) {
    if (this.tempChunk !== '') {
      this.push(this.tempChunk);
    }

    callback(null);
  }
}

module.exports = LineSplitStream;
