(function($) {
  $(function() {
    $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();
    $("select.herolist").selectpicker({style: 'btn-primary', menuStyle: 'dropdown-inverse'});
    $("select.herolist").click(function(e){
    })
  });
})(jQuery);

/** START TOORU APP **/

var AUTH_TOKEN = 'yqzIkvIXNZazdHuHqRxmBTw8TGQUWdNcgsKWsnjt'
var ROOT_URL = 'https://tooru.firebaseio.com/'

var fire, fireAuth, currentUser;
fire = new Firebase(ROOT_URL)
fireAuth = new FirebaseAuthClient(fire, authenticated)

function authenticated(error, user) {
  console.log("AUTHENTICATED ", error, user)

  currentUser = user

  if (user) {

    fire.child("users/"+user.provider+"/"+user.username).set(user)


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
  var updateContent = function(section){
    section = section
    var content = $(section)
    // window.location.hash = section
    content.show().siblings().hide()
    console.log(section)
  }
  updateContent(window.location.hash || '#home')

  var tooruTemplate = $('#tooruTemplate').html()
  fire.child('toorus').on('child_added', function(ref){
      var t = ref.val()
      console.log(t)
      var sound = $('.sound [value='+t.sound+']').text()
      var source = $('.source [value='+t.source+']').text()
      console.log(sound, source)
      var rendered = tooruTemplate.replace('%TEXT%', source + ': '+ t.query)
      rendered = rendered.replace('%SOUND%',sound)

      rendered = $(rendered)

      $('#toorus tbody').append(rendered)

      rendered.find("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();

  })

  var addTooru = function(){

  }

  $(".masthead .nav a").click(function(e){
    e.preventDefault()
    e.stopPropagation()
    updateContent($(this).data().menu)
  })

  $("[href=#logout]").click(function(e){
    e.preventDefault()
    e.stopPropagation()
    fireAuth.logout()
  })

  $("[data-login=foursquare]").click(function(e){
    e.preventDefault()
    e.stopPropagation()
    $('.login-error').text('').hide()

    window.open("/foursquare-login")

  })

  $("[data-login=twitter]").click(function(e){
    e.preventDefault()
    e.stopPropagation()
    $('.login-error').text('').hide()
    fireAuth.login('twitter')
  })

  $('[href=#create]').click(function(e) {
    e.preventDefault()
    e.stopPropagation()

    var newTooru = {
      query: $('[name=query]').val(),
      sound: $('[name=sound]').val(),
      source: $('[name=source]').val()
    }

    ss.rpc('toorus.create', currentUser, newTooru, function(error, created){
      $('#newTooru').modal('hide')
    })

  })


  $("#twitterSearch").change(function(e){

    console.log("SEARCHING ON TWITTER ", $(this).val(), " WITH USER ", currentUser)

    ss.rpc("twitter.search", currentUser, $(this).val(), function(tweet) {
    })

  })

  ss.event.on('tweet', function(tweet){
    console.log("GOT TWEET ", tweet)
    $('.twitts').append(tweet.text)
  });

  window.fsqAuth = function(id) {
    fire.child("users/foursquare/"+id).once('value', function(snapshot){
      var user = snapshot.val()
      currentUser = user;
      $('span.user').text(user.displayName)
      $('[data-login]').hide()
      $('[href=#logout]').show()


      console.log("fetching venues on server")
      ss.rpc("foursquare.venues", user, function() {

      })
    })
  }

})



