const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs')


const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  req.on('error', (e) => {
    res.statusCode = 500
    res.end('something went wrong')
  })

  if (pathname.includes('/')) {
    res.statusCode = 400
    res.end('Nested folders are not supported')
    return
  }

  switch (req.method) {
    case 'DELETE':
      if (!fs.existsSync(filepath)) {
        res.statusCode = 404
        res.end('No such file')
      } else {
        fs.unlink(filepath, (error) => { })
        res.statusCode = 200
        res.end('file is delete')
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
