/* QUICK CHAT DEMO */

// Delete this file once you've seen how the demo works

// Listen out for newMessage events coming from the server
ss.event.on('newMessage', function(message) {

  // Example of using the Hogan Template in client/templates/chat/message.jade to generate HTML for each message
  var html = ss.tmpl['chat-message'].render({
    message: message,
    time: function() { return timestamp(); }
  });

  // Append it to the #chatlog div and show effect
  return $(html).hide().appendTo('#chatlog').slideDown();
});

// Show the chat form and bind to the submit action
$('#demo').on('submit', function() {

  // Grab the message from the text box
  var text = $('#myMessage').val();

  // Call the 'send' funtion (below) to ensure it's valid before sending to the server
  return exports.send(text, function(success) {
    if (success) {
      return $('#myMessage').val('');
    } else {
      return alert('Oops! Unable to send message');
    }
  });
});

// Demonstrates sharing code between modules by exporting function
exports.send = function(text, cb) {
  if (valid(text)) {
    return ss.rpc('demo.sendMessage', text, cb);
  } else {
    return cb(false);
  }
};


// Private functions

var timestamp = function() {
  var d = new Date();
  return d.getHours() + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
};

var pad2 = function(number) {
  return (number < 10 ? '0' : '') + number;
};

var valid = function(text) {
  return text && text.length > 0;
};

/** START TOORU APP **/


var fire, fireAuth;
ss.rpc('fire.base', function(fire) {
  fire = new Firebase(fire.root_url)
  fireAuth = new FirebaseAuthClient(fire, authenticated)
});

var authenticated = function(error, user) {

  if (user) {
    $('span.user').text(user.displayName)
    $('[data-login]').hide()
    $('[href=#logout]').show()
  } else {
    $('span.user').text('')
    $('[data-login]').show()
    $('[href=#logout]').hide()
  }

  if (error) { $('.login-error').text(error.message).show() }

}

$(function(){

  $("[href=#logout]").click(function(e){
    e.preventDefault()
    e.stopPropagation()
    fireAuth.logout()
  })


  $("[data-login=twitter]").click(function(e){
    e.preventDefault()
    e.stopPropagation()
    $('.login-error').text('').hide()
    fireAuth.login('twitter')
  })

})



