var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(config.token.qa, {polling: true});
var rp = require('request-promise');

var answer = {
    bitcoin: '',
    ether: '',
    info: 'Write "e" for get Ethereum OR "b" for get Bitcoin',
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

          answer.bitcoin = 'Bitcoin now: $' + dataBitcoin.price_usd + '\n Last Update: ' + new Date(Number(dataEther.last_updated));
          answer.ether = 'Ethereum now: $' + dataEther.price_usd + '\n Last Update: ' + new Date(Number(dataEther.last_updated));
          sendMessage(fromId, msg.text);
      } else {
          error = 'Get data error';
          sendMessage(fromId, error);
      }
  })
});

function sendMessage(fromId, fromMessageText) {

  if (fromMessageText === 'e') {
    bot.sendMessage(fromId, answer.ether);

    return;
  }

  if (fromMessageText === 'b') {
    bot.sendMessage(fromId, answer.bitcoin);

    return;
  }

  if (fromMessageText === 'info') {
    bot.sendMessage(fromId, answer.info);

    return;
  }

  bot.sendMessage(fromId, answer.other);
}