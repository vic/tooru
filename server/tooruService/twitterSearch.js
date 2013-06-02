var _ = require('underscore')
var Twitter = require('ntwitter')

var twitter_consumer = {
  'consumer_key'        : 'Zh4IFWuRD7f9u31zCogp9Q',
  'consumer_secret'     : 'vtmxX25EFurSBIQPWv8p73i8VMM1Z8MJ06ZsBuKflI'
}
var twitter_token = {
  'access_token_key'    : '56745627-Yzt6sDLOCH4KCDyJvFA2L2Tkb3BVSd41sJECbbKXS',
  'access_token_secret' : 'SJGOP9eNFOccu2PrYnrS2TuhujWi2I4cpFV2Sc0'
}


exports.create = function(tooru, callback) {
  var credentials = _.extend({}, twitter_token, twitter_consumer)
  var twitter = new Twitter(credentials)
  var search = tooru.query

  twitter.verifyCredentials(function (err, data) {
    console.log("Tweet cred callback ", err, data)
  })

  twitter.stream('statuses/filter', {track: search}, function(stream) {
    stream.on('error', function(error, msg){
      console.log("TWITTER SEARCH ERROR", error, msg)
    })
    stream.on('data', function (data) {
      callback(data)
    })
  })
}

