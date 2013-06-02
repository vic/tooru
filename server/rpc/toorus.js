var fire = require('../fire')
var _ = require('underscore')

var tooruService = require('../tooruService')

exports.actions = function(req, res, ss) {
  req.use('session')

  return {
    create: function(user, tooru) {

      fire.child("toorus").push(tooru, function(tooruRef){
        tooruService[tooru.source].create(tooru, function(data){

          fire.child("totooru").push(_.extend(tooru, {data: data}))

        })
        res(tooruRef)
      })

    }
  }
}
