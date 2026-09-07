const http = require('http');
const fs = require('fs');
const path = require('path');

const root = 'D:\\工作\\中宏\\AI原型\\成长板块\\成长板块-整合';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let raw = req.url.split('?')[0];
  let p = decodeURIComponent(raw);
  if (p === '/') p = '/index.html';

  // Map 成长板块.html → dist-singlefile/index.html (built single-file output)
  if (p === '/成长板块.html' || p === '/index.html') {
    p = '/dist-singlefile/index.html';
  }

  const f = path.join(root, p);

  fs.readFile(f, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + p);
      return;
    }
    const ext = path.extname(f).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(9999, () => console.log('Server running at http://localhost:9999/ (root: 成长板块-整合)'));
