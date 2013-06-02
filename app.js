// My SocketStream 0.3 app

var http = require('http'),
    _ = require('underscore'),
    express = require('express'),
    ss = require('socketstream'),
    fire = require('./server/fire'),
    foursquare = require('./server/foursquare');


var app = express();

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['libs/reset.css', 'libs/bootstrap.css', 'libs/flat-ui.css', 'app.styl'],
  code: ['libs/jquery.min.js', 'libs/bootstrap.min.js', 'libs/bootstrap-switch.js', 'libs/bootstrap-select.js', 'app'],
  tmpl: '*'
});

// Serve this client on the root URL
app.get('/', function(req, res){
  res.serveClient('main');
});


app.get('/foursquare-login', function(req, res){
  res.writeHead(303, { 'location': foursquare.authUrl() });
  res.end();
})

app.get('/sound/:sound', function(req, res){
  fire.child("totooru").push({data: 'sound', sound: req.params.sound})
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('tooru');
})


app.post('/foursquare', function(req, res){
  fire.child("totooru").push({data: 'checkin', sound: 2})
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end('');
})

app.get('/foursquare-callback', function(req, res){
  foursquare.client.getAccessToken({
    code: req.query.code,
    grant_type: 'authorization_code'
  }, function (error, accessToken) {
    if(error) {
      res.send('An error was thrown: ' + error.message);
    }
    else {
      foursquare.client.Users.getUser('self', accessToken, function(error, data){
        if(error) {
          console.log("error obtaining user data ", error)
        } else {
          var user = data.user;
          console.log("user is ", user)
          data = _.extend({
            accessToken: accessToken,
            provider: 'foursquare',
            displayName: user.firstName + ' ' + user.lastName,
            username: user.id
          }, user)

          fire.child("users/foursquare/"+user.id).set(data, function(){
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end("<script>window.opener.focus(); window.opener.fsqAuth('"+user.id+"'); window.close();</script>")
          })
        }
      })
    }
  });
});

app.get('/tooru', function(req, res){

  fire.child('totooru').once('value', function(snap) {
    var sounds = []
    var performed = false;

    var perform = function() {
      if (performed) {
        return false
      } else {
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.end(JSON.stringify({sounds: sounds}))
        return performed = true
      }
    }

    snap.forEach(function(child) {
      sounds.push(child.val().sound * 1)
      child.ref().remove()

      if (sounds.length == 5) {
        perform()
      }
    })
    perform()

  })

})



// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();


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

var server = app.listen(process.env.PORT || 3000);
ss.start(server);
app.stack = ss.http.middleware.stack.concat(app.stack);
