var fire = require('../fire')

exports.actions = function(req, res, ss) {
  req.use('session')

  return {
    sign_in: function(user_data) {
      console.log("USER SIGNED IN ", user_data)
      fire.child("users/"+user_data.provider+"/"+user_data.id).set(user_data)
    },
    retrieve: function(user_data){
      fire.child("users/"+user_data.provider+"/"+user_data.id).once('value', function(snap){
        res(snap.val())
      })
    }
  }

}
