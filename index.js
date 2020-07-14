const server = require('http').createServer();
const url = require('url');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server: server });
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multipart  = require('connect-multiparty');
const compress   = require('compression');
const cors       = require('cors');
const helmet     = require('helmet');
const port = process.env.PORT || 7777;

const ejs = require('ejs');
const fs = require('fs');

const channels = {};

const clientsBase = `${__dirname}/client/build/embed/`;
const clients = {};
fs.readdirSync(clientsBase).forEach(file => {
  clients[file] = fs.readFileSync(`${clientsBase}${file}`, 'utf-8');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(multipart());
app.use(cors());
app.use(helmet());
app.use(compress());

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

app.all('/send/:channel', (req, res, next) => {
  const channel = req.params.channel;
  let message = req.query.message || req.body.message || req.body;
  let status;


  if (typeof message === 'object') {
    try {
      message = JSON.stringify(message);
    }
    catch(e) {}
  }


  if (message && typeof message === 'string' && Array.isArray(channels[channel])) {
    channels[channel].forEach((w) => {
      w.send(message);
    });
    status = "message sent";
  }
  else {
    status = "channel unavailable";
  }

  res.json({status});
});

app.use((req, res) => {
  res.render('index.ejs', {url: req.header.referer});
});

wss.on('connection', (ws, req) => {
  const location = url.parse(req.url, true);
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

  ws.on('error', (err) => {
    console.log(err.stack);
  });

  ws.on('close', () => {
    channels[channel].splice(channels[channel].indexOf(ws), 1);
  });

});

server.on('request', app);
server.listen(port, () => {
  console.log(`Listening on ${server.address().port}`);
});
