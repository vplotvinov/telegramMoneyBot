var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(config.token.qa, {polling: true});
var rp = require('request-promise');

var answer = {
    bitcoin: '',
    ether: '',
    info: 'Write "e" for get Ethereum OR "b" for get Bitcoin. For get all, please write "all"',
    other: 'Write "info" for get information',
}


bot.on('message', function (msg) {
  var fromId = msg.from.id;
  var res = 'Start request';

  rp('https://api.coinmarketcap.com/v1/ticker/', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          var dataBitcoin = body[0];
          var dataEther = body[1];

          answer.bitcoin = 'Bitcoin now: $' + dataBitcoin.price_usd + '\nLast Update: ' + new Date(Number(dataBitcoin.last_updated + '000'));
          answer.ether = 'Ethereum now: $' + dataEther.price_usd + '\nLast Update: ' + new Date(Number(dataEther.last_updated + '000'));
          sendMessage(fromId, msg.text);
      } else {
          error = 'Get data error';
          sendMessage(fromId, error);
      }
  })
});

function sendMessage(fromId, fromMessageText) {

  fromMessageText = fromMessageText.toLowerCase();

  switch(fromMessageText) {
    case 'e':
      bot.sendMessage(fromId, answer.ether);
      break;
    case 'b':
      bot.sendMessage(fromId, answer.bitcoin);
      break;
    case 'all':
      bot.sendMessage(fromId, answer.bitcoin + '\n' + answer.ether);
      break;
    case 'info':
      bot.sendMessage(fromId, answer.info);
      break;
    default:
      bot.sendMessage(fromId, answer.other);
  }
}