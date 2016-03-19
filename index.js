var server = require('http').createServer();
var url = require('url');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });
var express = require('express');
var app = express();
var port = process.env.PORT || 7777;

var ejs = require('ejs');
var fs = require('fs');
var client = fs.readFileSync(__dirname + '/client/client.js','utf8');

var channels = {};

app.all(/^\/client(\.js)?/i, function(req, res) {
  res.header('Cache-Control', 'public, max-age=2592000');
  res.contentType('application/javascript');
  res.send(ejs.render(client, {url: (req.headers['x-forwarded-proto'] === 'https' ? 'wss' : 'ws') + '://' + req.get('host')}));
});

app.use(function (req, res) {
  res.render('index.ejs');
});

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  var channel = ws.protocol || location.query.channel;

  if (Array.isArray(channels[channel])) {
    channels[channel].push(ws);
  }
  else {
    channels[channel] = [ws];
  }

  ws.on('message', function(message) {
    channels[channel].forEach(function(w) {
      w !== ws && w.send(message);
    });
  });

  ws.on('close', function(){
    channels[channel].splice(channels[channel].indexOf(ws), 1);
  });

});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });
