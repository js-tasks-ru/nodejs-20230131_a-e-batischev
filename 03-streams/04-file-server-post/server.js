const url = require('url')
const http = require('http')
const path = require('path')
const fs = require('fs')
const LimitSizeStream = require('./LimitSizeStream')


const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname.slice(1)

  const filepath = path.join(__dirname, 'files', pathname)
  const limitStream = new LimitSizeStream({ limit: 1e6 })

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  const outStream = fs.createWriteStream(filepath, { flags: 'wx' })

  switch (req.method) {
    case 'POST':

      req.pipe(limitStream).pipe(outStream)

      limitStream.on('error', (e) => {
        if (e.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413
          res.end('Limit has been exceeded')
        } else {
          res.statusCode = 500
          res.end('something went wrong')
        }

        fs.unlink(filepath, (error) => { });
      })

      outStream.on('error', (e) => {
        if (e.code === 'EEXIST') {
          res.statusCode = 409
          res.end('file exists')
        } else {
          res.statusCode = 500
          res.end('something went wrong')
          fs.unlink(filepath, (error) => { })
        }
      })

      outStream.on('finish', () => {
        res.code = 201
        res.end('file save')
      })

      req.on('aborted', () => {
        fs.unlink(filepath, (error) => { });
      })
      break;

    default:
      res.statusCode = 501
      res.end('Not implemented')
  }
});

module.exports = server
