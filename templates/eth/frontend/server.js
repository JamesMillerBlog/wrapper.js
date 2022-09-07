// const { createServer } = require('https');
const httpsServer = require('https').createServer;
// const httpServer = require('http').createServer;
const { parse } = require('url');
const { readFileSync } = require('fs');
const next = require('next');

// const httpsPort = 2000;
const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync('./cert/key.pem'),
  cert: readFileSync('./cert/cert.pem')
};


app.prepare()
  .then(() => {
    httpsServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      
      handle(req, res, parsedUrl);
    }).listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${port}`);
    })
  });
  
// app.prepare()
// .then(() => {
//   httpServer((req, res) => {
//     const parsedUrl = parse(req.url, true);
//     handle(req, res, parsedUrl);
//   }).listen(port, err => {
//     if (err) throw err;
//     console.log(`> Ready on https://localhost:${port}`);
//   })
// })