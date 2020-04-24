const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'DELETE':
      return deleteFileHandler(req, res);
    default:
      return notImplementedError(res);
  }
});

function deleteFileHandler(req, res) {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    return noNestedError(res);
  }

  fs.unlink(filepath, (err) => {
    if (!err) {
      res.statusCode = 200;
      return res.end(`File ${filepath} was deleted successfuly`);
    }

    if (err.code === 'ENOENT') {
      res.statusCode = 404;
      return res.end('Not found');
    }

    return notImplementedError(res);
  });
}

function noNestedError(res) {
  res.statusCode = 400;
  res.end('Nested folders are not supported');
}

function notImplementedError(res) {
  res.statusCode = 500;
  res.end('Not implemented');
}

module.exports = server;
