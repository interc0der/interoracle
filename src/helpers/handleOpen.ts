import dotenv from 'dotenv';
dotenv.config();


const binance = (ws:any,channels:string[]) => {
  return
  };

const binanceUS = (ws:any,channels:string[]) => {
  return
};

const bitso = (ws:any,channels:string[]) => {

  for (let i=0; i<channels.length; i++) {
    let message = JSON.stringify({ 
      action: 'subscribe', 
      book: channels[i], 
      type: 'trades' })

    ws.send(message);
  };
}

const bitstamp = (ws:any,channels:string[]) => {

  for (let i = 0; i<channels.length; i++){
      const message = JSON.stringify({ 
        "event": "bts:subscribe",
        "data": {
            "channel": channels[i]
        }})

      ws.send(message);
  };
}

const kraken = (ws:any,channels:string[]) => {
  const message = JSON.stringify({
    "event": "subscribe",
    "pair": channels,
    "subscription": {
      "name": "trade"
    }
  })

  return ws.send(message);
}

const coinbase = (ws:any,channels:string[]) => {
  const message = JSON.stringify(
    {
        "type": "subscribe",
        "channels": [{ "name": "ticker", "product_ids": channels }]
    }
  )
  return ws.send(message);
}

const kucoin = (ws:any,channels:string[]) => {
  const message = JSON.stringify(
    { 
        "id": 1545910660739,                          //The id should be an unique value
        "type": "subscribe",
        "topic": `/market/ticker:${channels}`,  //Topic needs to be subscribed. Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
        "privateChannel": false,                      //Adopted the private channel or not. Set as false by default.
        "response": true                              //Whether the server needs to return the receipt information of this subscription or not. Set as false by default.
    }
  )
  return ws.send(message);

}

const ftx = (ws:any,channels:string[]) => {
  for (let i=0; i<channels.length; i++) {
  const message = JSON.stringify(
    {'op': 'subscribe', 
    'channel': 'trades', 
    'market': channels[i]
})

  return ws.send(message);
}

}

const huobi = (ws:any,channels:string[]) => {

  for (let symbol of channels) {
    ws.send(JSON.stringify({
        "sub": `market.${symbol}.trade.detail`,
        "id": `${symbol}`
    }));
}
};

const cryptoX = (ws:any,channels:string[]) => {
  const message = JSON.stringify(
    {
        "id": 11,
        "method": "subscribe",
        "params": {
          "channels": channels
        },
        "nonce": 1587523073344
      }
)

  return ws.send(message);
}

const gate = (ws:any,channels:string[]) => {
    var msg = {
      id: 1234,
      method: 'trades.subscribe',
      params: channels
  };
  ws.send(JSON.stringify(msg));
};

const okex = (ws:any,channels:string[]) => {

  ws.send(JSON.stringify({
      "op": "subscribe",
      "args": [
        {
          "channel": "tickers",
          "instId": "LTC-USD-200327"
        },
        {
          "channel": "candle1m",
          "instId": "LTC-USD-200327"
        }
      ]
  }))
}

const bitfinex = (ws:any,channels:string[]) => {
  for (let symbol of channels) {
    ws.send(JSON.stringify({
      "event": "subscribe",
      "channel": "trades",
      "pair": symbol
      }));
  }
}

const poloniex = (ws:any,channels:string[]) => {
  ws.send(JSON.stringify({
    "command": "subscribe", 
    "channel": 1002
    }));
}

const handleOpen = (exchange:string,ws:any,channels:string[]) => {
  let response
  if (exchange == 'BINANCE') response = binance(ws,channels)
  if (exchange == 'BINANCEUS') response = binanceUS(ws,channels)
  if (exchange == 'COINBASE') response = coinbase(ws,channels)
  if (exchange == 'KUCOIN') response = kucoin(ws,channels)
  if (exchange == 'KRAKEN') response = kraken(ws,channels)
  if (exchange == 'BITSTAMP') response = bitstamp(ws,channels)
  if (exchange == 'BITSO') response = bitso(ws,channels)
  if (exchange == 'FTX') response = ftx(ws,channels)
  if (exchange == 'HUOBIPRO') response = huobi(ws,channels)
  if (exchange == 'CRYPTO') response = cryptoX(ws,channels)
  if (exchange == 'GATEIO') response = gate(ws,channels)
  if (exchange == 'OKEX') response = okex(ws,channels)
  if (exchange == 'BITFINEX') response = bitfinex(ws,channels)
  if (exchange == 'POLONIEX') response = poloniex(ws,channels)
  return response
}

export default handleOpen