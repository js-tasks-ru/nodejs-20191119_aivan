const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'GET':
      return getHandler(req, res);
    default:
      res.statusCode = 501;
      return res.end('Not implemented');
  }
});

function getHandler(req, res) {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  // nested files are not supported
  if (pathname.includes('/')) {
    res.statusCode = 400;
    return res.end('Not found');
  }


  const fileReadStream = fs.createReadStream(filepath);

  fileReadStream.on('error', () => {
    res.statusCode = 404;
    res.end('Not found file');
  });

  res.statusCode = 200;
  fileReadStream.pipe(res);
}

module.exports = server;
