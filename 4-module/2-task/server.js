const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  switch (req.method) {
    case 'POST':
      return createFileHandler(req, res);
    default:
      res.statusCode = 500;
      res.end('Not implemented');
  }
});

function createFileHandler(req, res) {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    return res.end('Nested folders are not supported');
  }

  return fs.open(filepath, 'wx', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        res.statusCode = 409;
        return res.end('File already exists');
      }

      res.statusCode = 500;
      return res.end('Server error');
    }

    const writeStream = fs.createWriteStream(filepath);
    const limitSizeStream = new LimitSizeStream({limit: 1048576});

    req.pipe(limitSizeStream).pipe(writeStream);

    req.on('error', (err) => {
      fs.unlink(filepath, (err) => {
        res.statusCode = 500;
        return req.end('Server error');
      });
    });

    req.on('end', () => {
      res.statusCode = 201;
      res.end('Successfuly saved' + pathname);
    });

    res.on('close', () => {
      if (!res.finished) {
        res.statusCode = 500;
        fs.unlink(filepath, () => {});
        res.end();
      }
    });

    limitSizeStream.on('error', (error) => {
      res.statusCode = 413;
      res.end('Your file size exceeds 1mb limit');
    });
  });
}

module.exports = server;
