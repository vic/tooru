var Firebase = require('firebase')

var AUTH_TOKEN = 'yqzIkvIXNZazdHuHqRxmBTw8TGQUWdNcgsKWsnjt'
var ROOT_URL = 'https://tooru.firebaseio.com/'

var fire = new Firebase(ROOT_URL)

fire.root_url = ROOT_URL
fire.auth_token = AUTH_TOKEN

module.exports = fire
