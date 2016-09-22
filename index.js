const server = require('http').createServer();
const url = require('url');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });
const express = require('express');
const app = express();
const port = process.env.PORT || 7777;

const ejs = require('ejs');
const fs = require('fs');
const clients = {
  'client.js': fs.readFileSync(`${__dirname}/client/build/embed/client.js`,'utf8'),
  'client.min.js': fs.readFileSync(`${__dirname}/client/build/embed/client.min.js`,'utf8'),
  'client.next.js': fs.readFileSync(`${__dirname}/client/build/embed/client.next.js`,'utf8'),
  // 'client.next.min.js': fs.readFileSync(`${__dirname}/client/build/embed/client.next.min.js`,'utf8'),
  // 'client.babel.js': fs.readFileSync(`${__dirname}/client/build/embed/client.babel.js`,'utf8'),
  // 'client.babel.min.js': fs.readFileSync(`${__dirname}/client/build/embed/client.babel.min.js`,'utf8'),
}

const channels = {};

app.all('/:client', (req, res, next) => {
  const client = clients[req.params.client];
  if (client) {
    res.header('Cache-Control', 'public, max-age=2592000');
    res.contentType('application/javascript');
    res.send(ejs.render(client, {url: `${(req.headers['x-forwarded-proto'] === 'https' ? 'wss' : 'ws')}://${req.get('host')}`}));
  }
  else {
    next();
  }
});

app.use((req, res) => {
  res.render('index.ejs');
});

wss.on('connection', (ws) => {
  const location = url.parse(ws.upgradeReq.url, true);
  const channel = ws.protocol || location.query.channel;

  if (Array.isArray(channels[channel])) {
    channels[channel].push(ws);
  }
  else {
    channels[channel] = [ws];
  }

  ws.on('message', (message) => {
    channels[channel].forEach((w) => {
      w !== ws && w.send(message);
    });
  });

  ws.on('close', () => {
    channels[channel].splice(channels[channel].indexOf(ws), 1);
  });

});

server.on('request', app);
server.listen(port, () => {
  console.log(`Listening on ${server.address().port}`);
});
