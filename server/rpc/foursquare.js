
var fsq = require('../foursquare')
var core = require('node-foursquare/lib/core')


exports.actions = function(req, res, ss) {
  req.use('session')
  return {
    venues: function(user) {
      var c = core(fsq.config)

      console.log("obtaining user venues ", user)
      c.callApi("/venues/managed", user.accessToken, {}, function(error, data){
        console.log("user venues: ", data, error)
      })
    }
  }
}
