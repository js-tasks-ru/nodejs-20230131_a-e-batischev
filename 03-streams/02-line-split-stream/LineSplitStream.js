const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.eol = os.EOL;
    this.theRest = '';
  }

  _transform(chunk, encoding, callback) {
    const newChunk = chunk.toString();

    if (newChunk.endsWith(`${this.eol}`)) {
      let arr = newChunk.split(`${this.eol}`);

      if (this.rest !== '') {
        arr[0] = this.theRest + arr[0];
      }

      for (let el of arr) {
        this.push(el);
      }

      this.theRest = '';
    } else {
      let arr = newChunk.split(`${this.eol}`);

      if (this.rest !== '') {
        arr[0] = this.theRest + arr[0];
      };

      this.theRest = arr.pop();

      for (let el of arr) {
        this.push(el);
      }

    }
    callback();
  }

  _flush(callback) {
    if (this.theRest !== '') {
      callback(null, this.theRest);
    } else {
      callback();
    }
  }
}
module.exports = LineSplitStream;


