const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');


class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit
    this.body = []
  }


  _transform(chunk, encoding, callback) {
    const data = this.body.join(' ')

    if (Buffer(data).length >= this.limit) {
      callback(new LimitExceededError())
    } else {
      this.body.push(chunk)
      callback(null, chunk)
    }
  }
}


module.exports = LimitSizeStream;







