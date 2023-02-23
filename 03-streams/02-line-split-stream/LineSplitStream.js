const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.eol = os.EOL;
    this.theRest = '';
  }

  _transform(chunk, encoding, callback) {
    const newChunk = chunk.toString()

    if (newChunk.endsWith(`${this.eol}`)) {
      let array = newChunk.split(this.eol)

      if (this.rest !== '') {
        array[0] = this.theRest + array[0];
      }

      for (const el of array) {
        this.push(el)
      }

      this.theRest = ''
    } else {
      let array = newChunk.split(this.eol)

      if (this.rest !== '') {
        array[0] = this.theRest + array[0];
      }
      this.theRest = array.pop();

      for (const el of array) {
        this.push(el)
      }
    }
    callback()
  }
  _flush(callback) {
    callback(null, this.theRest)
  }
}
module.exports = LineSplitStream;


