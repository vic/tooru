// My SocketStream 0.3 app

var http = require('http'),
    ss = require('socketstream'),
    fire = require('./server/fire');

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/reset.css', 'libs/bootstrap.css', 'libs/flat-ui.css', 'app.styl'],
  code: ['libs/jquery.min.js', 'app'],
  tmpl: '*'
});

// Serve this client on the root URL
ss.http.route('/', function(req, res){
  res.serveClient('main');
});


ss.http.route('/tooru', function(req, res){

  fire.child('totooru').once('value', function(snap) {
    var sounds = []
    snap.forEach(function(child) {
      sounds.push(child.val().sound * 1)
    })
    fire.child('totooru').remove()
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(JSON.stringify({sounds: sounds}))
  })


})

// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(process.env.PORT || 3000);

ss.ws.transport.use(require('ss-engine.io'), {
  client: {
    transports: ["polling"],
    upgrade: false
  },
  server: {
    transports: ["polling"],
    allowUpgrades: false,
    pingInterval: 10000
  }
});

// Start SocketStream
ss.start(server);
