const url = require('url')
const http = require('http')
const path = require('path')
const fs = require('fs')
const os = require('os');

const server = new http.Server()

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname.slice(1)
  const filepath = path.join(__dirname, 'files', pathname)
  const stream = fs.createReadStream(filepath)

  stream.on('error', (e) => {
    if (pathname.includes('/')) {
      res.statusCode = 400
      res.end('Nested folders are not supported')
    } else if (!fs.existsSync(filepath)) {
      res.statusCode = 404
      res.end('No such file')
    }
  })

  switch (req.method) {
    case 'GET':

      stream.on('data', chunk => {
        res.write(chunk)
      })

      stream.on('end', () => {
        res.end()
      })

      req.on('aborted', () => {
        stream.destroy()
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented')
  }
});

module.exports = server
