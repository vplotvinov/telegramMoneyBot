var RequestByMoney = function () {
  this.ajaxUrl = {
    bitcoin: 'http://api.coindesk.com/v1/bpi/currentprice.json',
    usd: 'https://www.cbr-xml-daily.ru/daily_json.js',
    money: 'https://api.coinmarketcap.com/v1/ticker/',
  }
}

RequestByMoney.prototype.getBitcoin = function () {

}

RequestByMoney.prototype.getUSD = function () {

}
