var fire = require('../fire')

var base = {
  root_url: fire.root_url,
  auth_token: fire.auth_token
}

exports.actions = function(req, res, ss) {
  req.use('session');

  return {
    'base': function() { return res(base) }
  }

}
