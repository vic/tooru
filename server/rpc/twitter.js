var ss = require('socketstream')
var _ = require('underscore')
var twitter_consumer = {
  'consumer_key'        : 'Zh4IFWuRD7f9u31zCogp9Q',
  'consumer_secret'     : 'vtmxX25EFurSBIQPWv8p73i8VMM1Z8MJ06ZsBuKflI'
}

var twitter_token = {
  'access_token_key'        : '56745627-Yzt6sDLOCH4KCDyJvFA2L2Tkb3BVSd41sJECbbKXS',
  'access_token_secret' : 'SJGOP9eNFOccu2PrYnrS2TuhujWi2I4cpFV2Sc0'
}

var Twitter = require('ntwitter')

exports.actions = function(req, res, ss) {
  req.use('session')

  return {
    search: function(user, search) {
      if( !!! user ) { return }

      var credentials = _.extend({
        access_token_key: user.accessToken,
        access_token_secret: user.accessTokenSecret
      }, twitter_consumer)

      var twitter = new Twitter(credentials)

      twitter.verifyCredentials(function (err, data) {
        console.log("Tweet cred callback ", err, data)
      })


      twitter.stream('statuses/filter', {track: search}, function(stream) {
        stream.on('error', function(error, msg){
          console.log("TWITTER SEARCH ERROR", error, msg)
        })
        stream.on('data', function (data) {
          console.log("GOT FROM TWITRER", data, " sending to ", req.socketId)
          ss.publish.socketId(req.socketId, 'tweet', data)
        });
      });

    }
  }
}

