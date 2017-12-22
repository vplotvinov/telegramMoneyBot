var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(config.token.qa, {polling: true});
var rp = require('request-promise');

var answer = {
    info: 'Write "e" for get Ethereum \n "b" for get Bitcoin \n "bc" for get Bitcoin Cash \n "i" for get IOTA. For get all, please write "all"',
    other: 'Write "info" for get information@',
}


bot.on('message', function (msg) {
  var fromId = msg.from.id;

  rp('https://api.coinmarketcap.com/v1/ticker/')
    .then(function (body) {
        handlerRequest(JSON.parse(body), fromId, msg.text);
    })
    .catch(function(err) {
      console.log(err);
    });
});

function handlerRequest(dataFromApi, fromId, fromMessageText) {
  for (var i = 0; i < dataFromApi.length; i++) {
    var currentItem = dataFromApi[i];

    switch(currentItem.id) {
      case 'bitcoin':
        createMessage('bitcoin', dataFromApi[i]);
        break;
      case 'ethereum':
        createMessage('ethereum', dataFromApi[i]);
        break;
      case 'bitcoin-cash':
        createMessage('bitcoin-cash', dataFromApi[i]);
        break;
      case 'iota':
        createMessage('iota', dataFromApi[i]);
        break;
    }

    if (i == dataFromApi.length - 1) {
      sendMessage(fromId, fromMessageText);
    }
  }
}

function createMessage(name, data) {
  answer[name] = '~ ' + data.name + ' (' + data.symbol + ') ' + ' now: $' + data.price_usd + '\n'
                + 'Last Update:  ' + new Date(Number(data.last_updated + '000')) + '\n'
                + 'Percent change 1h:   ' + data.percent_change_1h + '\n'
                + 'Percent change 24h: ' + data.percent_change_24h + '\n'
                + 'Percent change 7d:   ' + data.percent_change_7d + '\n\n';
}

function sendMessage(fromId, fromMessageText) {
  console.log(fromId, fromMessageText);

  fromMessageText = fromMessageText.toLowerCase();

  switch(fromMessageText) {
    case 'e':
      bot.sendMessage(fromId, answer['ethereum']);
      break;
    case 'b':
      bot.sendMessage(fromId, answer['bitcoin']);
      break;
    case 'bc':
      bot.sendMessage(fromId, answer['bitcoin-cash']);
      break;
    case 'i':
      bot.sendMessage(fromId, answer['iota']);
      break;
    case 'all':
      bot.sendMessage(fromId, answer['bitcoin'] + '\n' + answer['ethereum'] + '\n' + answer['bitcoin-cash'] + '\n' + answer['iota']);
      break;
    case 'info':
      bot.sendMessage(fromId, answer['info']);
      break;
    default:
      bot.sendMessage(fromId, answer['other']);
  }
}