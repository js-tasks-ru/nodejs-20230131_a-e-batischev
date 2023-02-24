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
  const limitStream = new LimitSizeStream({ limit: 1048576 })

  const outStream = fs.createWriteStream(filepath)

  outStream.on('error', (e) => {
    if (pathname.includes('/')) {
      console.log(pathname);
      res.statusCode = 400

      res.end('Nested folders are not supported')
    } else if (e.code === 'ENOENT') {
      res.statusCode = 404
      res.end('error 404')
    } else {
      res.statusCode = 500
      res.end('something went wrong')
    }
  })

  if (fs.existsSync(filepath)) {
    res.statusCode = 409
    res.end('error 409')
  }

  limitStream.on('error', () => {
    res.statusCode = 413
    outStream.destroy()
    fs.unlinkSync(filepath);
    res.end('Limit has been exceeded')
  })


  switch (req.method) {
    case 'POST':

      req.on('data', chunk => {
        limitStream.write(chunk)
      })

      limitStream.on('data', chunk => outStream.write(chunk))

      req.on('end', () => limitStream.end())

      limitStream.on('end', () => res.end('file create'))

      req.on('aborted', () => {
        fs.unlinkSync(filepath);
        outStream.destroy()
      })
      break;

    default:
      res.statusCode = 501
      res.end('Not implemented')
  }
});

module.exports = server 
