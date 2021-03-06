import utils from './utils';
import { PriceArrayType } from 'types/request';
import pako from 'pako';

const binance = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
    try {
        const resp = JSON.parse(evt.data);
        if (resp == undefined) return;
        if (resp.data.p == undefined) return;

        let resp_channels = channels.map((pair:string) => pair.toUpperCase())

        let array = resp_channels.map((ticker:any, index:number) => {
            if(resp.data.s.indexOf(ticker) > -1 ) {
              let channel = pairs[index+1]
              let symbol = channel.join('_')

              if(resp.data.m == true) {
                var taker = "BUY"
              } else {
                var taker = "SELL"
              }

            return({
                "type": type,
                "symbol_id": symbol,
                "sequence": ++sequence,
                "time_exchange": resp.data.T,
                "time_wakedapi": Date.now(),
                "uuid": id,
                "price": parseFloat(resp.data.p),
                "size": parseFloat(resp.data.q),
                "taker_side": taker
              })
            }

            return
      })

      return array.filter(Boolean)[0]

      } catch (error) {
        return
      }
  };

 const binanceUS = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
    try{
        const resp = JSON.parse(evt.data);
  
        if (resp == undefined) return;
        if (resp.data.p == undefined) return;

        let resp_channels = channels.map((pair:string) => pair.toUpperCase())

        let array = resp_channels.map((ticker:any, index:number) => {
              if(resp.data.s.indexOf(ticker) > -1 ) {
                let channel = pairs[index+1]
                let symbol = channel.join('_')

              if(resp.data.m == true) {
                var taker = "BUY"
              } else {
                var taker = "SELL"
              }

            return({
                "type": type,
                "symbol_id": symbol,
                "sequence": ++sequence,
                "time_exchange": resp.data.T,
                "time_wakedapi": Date.now(),
                "uuid": id,
                "price": parseFloat(resp.data.p),
                "size": parseFloat(resp.data.q),
                "taker_side": taker
              })
            }

            return
      })

      return array.filter(Boolean)[0]
  
    } catch (error) {
      console.log(error)
          return
    }
};

interface IBitsoTradeRepsonse {
  type: string, // type
  book?: string, // book
  payload?: [
    {
      i: number, // A unique number identifying the transaction
      a: string, // Amount
      r: string, // Rate
      v: string, // Value
      mo: string, // Maker Order ID
      to: string, // Taker Order ID
      t: number // Maker side, 0 indicates buy 1, indicates sell
    }
  ]
}

interface IBitsoServerRepsonse {
  type: string // 'trades'
  action?: string, // 'subscribe'
  response?: string, // 'subscribe'
  time?: number, // 1652556518701
}

interface IBitsoKeepAlive {
   type: string // 'ka' 
}

type IBitsoRepsonse = IBitsoTradeRepsonse | IBitsoServerRepsonse | IBitsoKeepAlive


const bitso = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
    try {
        const resp:IBitsoRepsonse = JSON.parse(evt.data);
        if (resp == undefined) return;
        if ("action" in resp && resp.action == "subscribe") return;
        if (resp.type == "ka") return;

        let array = channels.map((ticker:any, index:number) => {
          if( "book" in resp 
              && resp.book 
              && resp.book.indexOf(ticker) > -1 ) {
                let channel = pairs[index+1]
                let symbol = channel.join('_')

          var taker = "SELL"
          var price, size
          if( "payload" in resp 
              && resp.payload
              && resp.payload[0].t == 0) taker = "BUY"

          if( "payload" in resp 
              && resp.payload ) { 
                price = parseFloat(resp.payload[0].r)
                size = parseFloat(resp.payload[0].a)
              }

           return ({
              "type": type,
              "symbol_id": symbol,
              "sequence": ++sequence,
              "time_exchange": undefined,
              "time_wakedapi": Date.now(),
              "uuid": id,
              "price": price,
              "size": size,
              "taker_side": taker
            })
          }
          return
        })

        return array.filter(Boolean)[0]

      } catch (error) {
          return
    }
}

const bitstamp = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
   
    try {
        const resp = JSON.parse(evt.data);
  
        if (resp == undefined) return;
        if (resp.data.price == undefined) return;

        let array = channels.map((ticker:any, index:number) => {
          if( resp.channel == ticker) {
            let channel = pairs[index+1]
            let symbol = channel.join('_')

            return ({
                    "type": type,
                    "symbol_id": symbol,
                    "sequence": ++sequence,
                    "time_exchange": parseFloat(resp.data.microtimestamp),
                    "time_wakedapi": Date.now(),
                    "uuid": id,
                    "price": resp.data.price,
                    "size": resp.data.amount,
                    "taker_side": "BUY"
                  })
          }

          return

          })

          return array.filter(Boolean)[0]

      } catch (error) {
        console.log(error)
        return
    }
}

const kraken = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
    try {
        const resp = JSON.parse(evt.data);
  
        if( resp.event == "heartbeat") return;
        if( resp.event == "systemStatus") return;
        if( resp.event == "subscriptionStatus") return;

        let array = channels.map((ticker:any, index:number) => {
          if( resp[3].indexOf(ticker) > -1 ) {
            let channel = pairs[index+1]
            let symbol = channel.join('_')

                let taker;
                if (resp[1][0][3] == "b") taker = "BUY" 
                if (resp[1][0][3] != "b") taker = "SELL"

                let weightedInput = resp[1].map((resp:any) => {
                    return ({
                      price: parseFloat(resp[0]), 
                      amount: parseFloat(resp[1])
                    })
                }) 

                let sum = 0;
                let price = utils.weighted_average(weightedInput)

                weightedInput.map((resp:PriceArrayType) => {
                        sum += resp.amount
                })
                
                return ({
                    "type": type,
                    "symbol_id": symbol,
                    "sequence": ++sequence,
                    "time_exchange": resp[1][0][2],
                    "time_interoracle": Date.now(),
                    "uuid": id,
                    "price": price,
                    "size": sum,
                    "taker_side": taker
                })
            }

            return
      })

      return array.filter(Boolean)[0]

    } catch (error) {
      console.log(error)
        return
    }
}

const coinbase = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
    try {
        const resp = JSON.parse(evt.data);
        
        if (resp == undefined) return;
        if (resp.price == undefined) return;
  
        let array = channels.map(( ticker:string ) => {
            if(resp.product_id.indexOf(ticker) > -1 ) {
              let asset

              if (ticker.includes('USDT')
              || ticker.includes('USDC')
              || ticker.includes('BUSD')
              ) {
                asset = ticker.slice(0,-5)
              } else {
                asset = ticker.slice(0,-4)
              }

              var base = ticker.replace(asset+"-",'');

               return ({
                "type": type,
                "symbol_id": `COINBASE_SPOT_${asset}_${base}`,
                "sequence": ++sequence,
                "time_exchange": new Date(resp.time).getTime(),
                "time_interoracle": Date.now(),
                "uuid": id,
                "price": parseFloat(resp.price),
                "size": parseFloat(resp.last_size),
                "taker_side": resp.side.toUpperCase()
              })
            }
            return
        })

        return array.filter(Boolean)[0]

    } catch (error) {
      console.log(error)
          return
    }
}

const kucoin = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {

    try {
        const resp = JSON.parse(evt.data);

        if (resp.type == "ack") return;
        if (resp == undefined) return;
        if (resp.data.price == undefined) return;
  
        let array = channels.map((ticker:string) => {
            if(resp.topic.indexOf(ticker) > -1 ) {
            
              let asset
 
              if (ticker.includes('USDT')
              || ticker.includes('USDC')
              || ticker.includes('BUSD')
              ) {
                asset = ticker.slice(0,-5)
              } else {
                asset = ticker.slice(0,-4)
              }

              var base = ticker.replace(asset+"-",'');

                return ({
                    "type": type,
                    "symbol_id": `KUCOIN_SPOT_${asset}_${base}`,
                    "sequence": ++sequence,
                    "time_exchange": resp.data.time,
                    "time_interoracle": Date.now(),
                    "uuid": id,
                    "price": parseFloat(resp.data.price),
                    "size": parseFloat(resp.data.size),
                    //"taker_side": taker
                  })
                   
              }
              return
        })
        return array.filter(Boolean)[0]

      } catch (error) {
        console.log(error)
          return
    }
}

const ftx = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
    try {
        const resp = JSON.parse(evt.data);
        if( resp.type == "subscribed") return;
        if( resp.type == "error") {
          console.log('FTX:', resp)
          return};

        let array = channels.map((ticker:string) => {

          if(resp.market.indexOf(ticker) > -1 ) {
            let asset

            if (ticker.includes('USDT')
            || ticker.includes('USDC')
            || ticker.includes('BUSD')
            ) {
              asset = ticker.slice(0,-5)
            } else {
              asset = ticker.slice(0,-4)
            }
                    
            let base = ticker.replace(asset+"/",'');

            let weightedInput = resp.data.map((resp:any) => {
              return { price: parseFloat(resp.price), amount: parseFloat(resp.size) }
            }) 

            let sum = 0;
            let price = utils.weighted_average(weightedInput)
            weightedInput.map((resp: PriceArrayType) => {
                sum += resp.amount
            })

            return ({
                "type": type,
                "symbol_id": `FTX_SPOT_${asset}_${base}`,
                "sequence": ++sequence,
                "time_exchange": new Date(resp.data[0].time).getTime(),
                "time_wakedapi": Date.now(),
                "uuid": id,
                "price": price,
                "size": sum,
                "taker_side": resp.data[0].side.toUpperCase()
            })
        }
        return 
      })
      return array.filter(Boolean)[0]
    } catch (error) {
      console.log(error)
        return
    }
}

 const huobi = (ws: any, evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {

    let text = pako.inflate(evt.data, {
        to: 'string'
    });

    let msg = JSON.parse(text);

    if (msg.ping) { return ws.send(JSON.stringify({pong: msg.ping}))};
    if (!msg.ping) {

    try{
      let symbol = msg.ch.split('.')[1];

      let array = msg.tick.data.map((resp:any) => {

      var asset = symbol.slice(0,-4).toUpperCase();
      var base = symbol.replace(asset.toLowerCase(),'').toUpperCase();

      return ({
          "type": type,
          "symbol_id": `HUOBIPRO_SPOT_${asset}_${base}`,
          "sequence": ++sequence,
          "time_exchange": resp.ts,
          "time_wakedapi": Date.now(),
          "uuid": id,
          "price": parseFloat(resp.price),
          "size": parseFloat(resp.amount),
          "taker_side": resp.direction.toUpperCase()
        })
    })
    return array.filter(Boolean)[0]
  } catch (error) {
      return
    }
  }
}

const cryptoX = (ws:any, evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
    try {
        const resp = JSON.parse(evt.data);
    
            if (resp.method == 'public/heartbeat') {
                  const message = JSON.stringify({
                            "id": resp.id,
                            "method": "public/respond-heartbeat"
                        })

                return ws.send(message);
            }

            if (resp.method != 'public/heartbeat') {
            let array = resp.result.data.map((data:any) => {
                var asset = data.i.slice(0, -5)
                var base = resp.result.instrument_name.replace(asset+"_",'')

                return ({
                    "type": type,
                    "symbol_id": `CRYPTO_SPOT_${asset}_${base}`,
                    "sequence": ++sequence,
                    "time_exchange": data.t,
                    "time_wakedapi": Date.now(),
                    "uuid": id,
                    "price": data.p,
                    "size": data.q,
                    "taker_side": data.s
                })
              })
            return array.filter(Boolean)[0]
          }
  
        } catch (error) {
            return
        }
}

const gate = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
    const resp = JSON.parse(evt.data);

    try{
      let array = resp.params[1].map((data:any) => {
        var asset = resp.params[0].slice(0, -5)
        var base = resp.params[0].replace(asset+"_",'')

              return ({
                "type": type,
                "symbol_id": `GATEIO_SPOT_${asset}_${base}`,
                "sequence": ++sequence,
                "time_exchange": data.time,
                "time_wakedapi": Date.now(),
                "uuid": id,
                "price": parseFloat(data.price),
                "size": parseFloat(data.amount),
                "taker_side": data.type.toUpperCase()
              })
        })
        return array.filter(Boolean)[0]

      } catch (error) {
          return
      }
}

const okex = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {

    let msg = JSON.parse(evt.data)

    if( msg.event == "error") return console.log(`OKEX Error: ${msg.msg}`);
    if( msg.event == "subscribe") return //console.log(`OKEX Subscribing to ${msg.channel}`);

    try{

      let array = msg.data.map( (data:any) => {
        let quantity = data.sz 
        if (data.sz == 0 ) quantity=0.000001
        let ticker = data.instId

        var asset, base

        if (ticker.includes('USDT')
        || ticker.includes('USDC')
        || ticker.includes('BUSD')
        ) {
          asset = ticker.slice(0,-5)
        } else {
          asset = ticker.slice(0,-4)
        }

        var base = ticker.replace(asset+"-",'');

        return ({
            "type": type,
            "symbol_id": `OKEX_SPOT_${asset}_${base}`,
            "sequence": ++sequence,
            "time_exchange": parseFloat(data.ts),
            "time_wakedapi": Date.now(),
            "uuid": id,
            "price": parseFloat(data.px),
            "size": parseFloat(quantity),
            "taker_side": "BUY"
          })
        })
        return array.filter(Boolean)[0]
  } catch (error) {
    console.log(error)
    return
  }
}

const bitfinex = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {

    let msg = JSON.parse(evt.data)

    if( msg.event == "subscribed") return //console.log(`BITFINEX Subscribing to ${msg.pair}`);

    // Heart beat send response back to client
    if( msg[1] == "hb") return;
  
        try{ 
            if (msg[1] == "te") {

            let ticker = msg[2].split('-')[1].slice(1)
            let asset=''

            if (ticker.includes('USDT')
            || ticker.includes('USDC')
            || ticker.includes('BUSD')
            ) {
              asset = ticker.slice(0,-4);
            } else {
              asset = ticker.slice(0,-3);
            }
                    
            var base = ticker.replace(asset,'');

            if (msg[msg.length-1] > 0) {var taker = "BUY"} else {var taker = "SELL"}

            return ({
            "type": type,
            "symbol_id": `BITFINEX_SPOT_${asset}_${base}`,
            "sequence": ++sequence,
            "time_exchange": msg[msg.length-3],
            "time_wakedapi": Date.now(),
            "uuid": id,
            "price": parseFloat(msg[msg.length-2]),
            "size": Math.abs(msg[msg.length-1]),
            "taker_side": taker
          })
      }
      return
  } catch (error) {
    console.log(error)
        return 
}
}

const poloniex = (tickers: string[][], evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {

    let msg = JSON.parse(evt.data);

    if(msg[1] == 1 ) return //console.log("Subscribing")

    try{
      let array = tickers.map((ticker:string[]) => {

        if(msg[2][0] == ticker[1]) {
          var base:string = ticker[0].slice(0,-4);
          var asset:string = ticker[0].replace(base+"_",'');
  
              return ({
                "type": type,
                "symbol_id": `POLONIEX_SPOT_${asset}_${base}`,
                "sequence": ++sequence,
                "time_exchange": undefined,
                "time_wakedapi": Date.now(),
                "uuid": id,
                "price": parseFloat(msg[2][1]),
                "size": undefined,
                "taker_side": "BUY"
            })
          }
          return
        })
        return array.filter(Boolean)[0]
    } catch (error) {
      console.log(error)
        return
    }
} 
 


const handleIncomingMsg = (
              ws:WebSocket,
              exchange:string,
              evt:any, 
              channels:string[],
              tickers:string[][], 
              type:string, 
              sequence:number, 
              id:string,
              pairs:string[]
        ) => {

  let response
  if (exchange == 'BINANCE') response = binance(evt, channels, pairs, type, sequence,id)
  if (exchange == 'BINANCEUS') response = binanceUS(evt, channels, pairs, type, sequence,id)
  if (exchange == 'COINBASE') response = coinbase(evt, channels, pairs, type, sequence,id)
  if (exchange == 'KUCOIN') response = kucoin(evt, channels, pairs, type, sequence,id)
  if (exchange == 'KRAKEN') response = kraken(evt, channels, pairs, type, sequence,id)
  if (exchange == 'BITSTAMP') response = bitstamp(evt, channels, pairs, type, sequence,id)
  if (exchange == 'BITSO') response = bitso(evt, channels, pairs, type, sequence,id)
  if (exchange == 'FTX') response = ftx(evt, channels, pairs, type, sequence,id)
  if (exchange == 'HUOBIPRO') response = huobi(ws, evt, channels, pairs, type, sequence,id)
  if (exchange == 'CRYPTO') response = cryptoX(ws, evt, channels, pairs, type, sequence,id)
  if (exchange == 'GATEIO') response = gate(evt, channels, pairs, type, sequence,id)
  if (exchange == 'OKEX') response = okex(evt, channels, pairs, type, sequence,id)
  if (exchange == 'BITFINEX') response = bitfinex(evt, channels, pairs, type, sequence,id)
  if (exchange == 'POLONIEX') response = poloniex(tickers, evt, channels, pairs, type, sequence,id) 
  return response
}
export default handleIncomingMsg;