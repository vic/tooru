var redirectUrl = "http://tooru.heroku.com/foursquare-callback"
//var redirectUrl = "http://localhost:5000/foursquare-callback"

var config = {
  'secrets' : {
    'clientId' : 'VK2NO50BLAY4QMYDWY5GZBP3MJROUGSELDG0SI0OFC1NYS2U',
    'clientSecret' : '5XXVU4D30UPPQ2X0DA0BRCA5YDDSQHXDN2SU1T4VI1VQGT1C',
    'redirectUrl' : redirectUrl
  }
}

var foursquare = require('node-foursquare')(config);

exports.config = config;
exports.client = foursquare;
exports.authUrl = function() {
  return foursquare.getAuthClientRedirectUrl()
}
