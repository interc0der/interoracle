import utils from './utils';
import { PriceArrayType } from 'src/interface/request';

const binance = (evt:any, channels:string[], type:string, sequence:number) => {
    try {
        const resp = JSON.parse(evt.data);
        if (resp == undefined) return;
        if (resp.data.p == undefined) return;

        let resp_channels = channels.map((pair:string) => pair.toUpperCase())

        let array = resp_channels.map((ticker:any) => {
            if(resp.data.s.indexOf(ticker) > -1 ) {
              let asset = ticker.slice(0,-4)
              var base = ticker.replace(asset,'');

              if(resp.data.m == true) {
                var taker = "BUY"
              } else {
                var taker = "SELL"
              }

            return({
                "type": type,
                "symbol_id": `BINANCE_SPOT_${asset}_${base}`,
                "sequence": ++sequence,
                "time_exchange": resp.data.T,
                "time_wakedapi": Date.now(),
                "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
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

 const binanceUS = (evt:any, channels:string[], type:string, sequence:number) => {
    try{
        const resp = JSON.parse(evt.data);
  
        if (resp == undefined) return;
        if (resp.data.p == undefined) return;

        let resp_channels = channels.map((pair:string) => pair.toUpperCase())

        let array = resp_channels.map((ticker:any) => {
            if(resp.data.s.indexOf(ticker) > -1 ) {
              let asset = ticker.slice(0,-4)
              var base = ticker.replace(asset,'');

              if(resp.data.m == true) {
                var taker = "BUY"
              } else {
                var taker = "SELL"
              }

            return({
                "type": type,
                "symbol_id": `BINANCE_SPOT_${asset}_${base}`,
                "sequence": ++sequence,
                "time_exchange": resp.data.T,
                "time_wakedapi": Date.now(),
                "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
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



const bitso = (evt:any, channels:string[], type:string, sequence:number) => {
    try {
        const resp = JSON.parse(evt.data);
        if (resp == undefined) return;
        if (resp.action == "subscribe") return;
        if (resp.type == "ka") return;

        let array = channels.map((ticker:any) => {
          if(resp.book.indexOf(ticker) > -1 ) {
          let initTicker = ticker
          if (ticker.length == 7) initTicker = ticker+'a'
          let asset = initTicker.slice(0,-5).toUpperCase();
          var base = ticker.replace(asset.toLowerCase()+"_",'').toUpperCase();
          if(resp.payload[0].t == 0) {var taker = "BUY"} else {var taker = "SELL"}

           return ({
               "type": type,
               "symbol_id": `BITSO_SPOT_${asset}_${base}`,
               "sequence": ++sequence,
               "time_exchange": undefined,
               "time_wakedapi": Date.now(),
               "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
               "price": parseFloat(resp.payload[0].r),
               "size": parseFloat(resp.payload[0].a),
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

const bitstamp = (evt:any, channels:string[], type:string, sequence:number) => {
    try {
        const resp = JSON.parse(evt);
  
        if (resp == undefined) return;
        if (resp.data.price == undefined) return;

        let array = channels.map((ticker:any) => {
          if(resp.channel.indexOf(ticker) > -1 ) {
            let initTicker = ticker

            if (ticker.length = 6) initTicker = ticker+'a'

            var asset = initTicker.slice(0,-4).toUpperCase();
            var base = ticker.replace(asset.toLowerCase(),'').toUpperCase();

            return ({
                    "type": type,
                    "symbol_id": `BITSTAMP_SPOT_${asset}_${base}`,
                    "sequence": ++sequence,
                    "time_exchange": parseFloat(resp.data.microtimestamp),
                    "time_wakedapi": Date.now(),
                    "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                    "price": resp.data.price,
                    "size": resp.data.amount,
                    "taker_side": "BUY"
                  })
                }

              return
          })

          return array.filter(Boolean)[0]

      } catch (error) {
          return
    }
}

const kraken = (evt:any, channels:string[], type:string, sequence:number) => {
    try {
        const resp = JSON.parse(evt.data);
  
        if( resp.event == "heartbeat") return;
        if( resp.event == "systemStatus") return;
        if( resp.event == "subscriptionStatus") return;
    
        let array = channels.map (( ticker:any) => {
            if(resp[3].indexOf(ticker) > -1 ) {
                let asset

                if( ticker.length < 8 ) asset = ticker.slice(0,-4)
                if( ticker.length >=8 ) asset = ticker.slice(0,-5)

                if( ticker.indexOf("XBT") > -1 ) asset = "BTC"
                if( ticker.indexOf("XDG") > -1 ) asset = "DOGE"

                if ( ticker.indexOf("ALGO") > -1  || ticker.indexOf("DOGE") > -1  ) {
                  if ( ticker.length< 9 ) asset = ticker.slice(0,-4)
                  if ( ticker.length >= 9 ) asset = ticker.slice(0,-5)
                }
                
                let base;
                if( ticker.indexOf("XBT") > -1 )  base = ticker.replace("XBT/",'')
                if( ticker.indexOf("XDG") > -1 ) base = ticker.replace("XDG/",'')
                if( ticker.indexOf("XDG") == -1 
                    && ticker.indexOf("XBT") == -1 ) base = ticker.replace(asset+"/",'');

                let taker;
                if (resp[1][0][3] == "b") taker = "BUY" 
                if (resp[1][0][3] != "b") taker = "SELL"

                let weightedInput = resp[1].map((resp:any) => {
                    return ({price: parseFloat(resp[0]), amount: parseFloat(resp[1])})
                }) 

                let sum = 0;
                let price = utils.weighted_average(weightedInput)

                weightedInput.map((resp:PriceArrayType) => {
                        sum += resp.amount
                })
                
                return ({
                    "type": type,
                    "symbol_id": `KRAKEN_SPOT_${asset}_${base}`,
                    "sequence": ++sequence,
                    "time_exchange": resp[1][0][2],
                    "time_wakedapi": Date.now(),
                    "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                    "price": price,
                    "size": sum,
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

/* const coinbase = (evt) => {
    try {
        const resp = JSON.parse(evt);
        
        if (resp == undefined) return;
        if (resp.price == undefined) return;
  
        cb_channels.map(( ticker ) => {
            if(resp.product_id.indexOf(ticker) > -1 ) {


              if(ticker.indexOf("ALGO") > -1   || ticker.indexOf("DOGE") > -1  ) {
                if (ticker.length< 9) {var asset = ticker.slice(0,-4)} 
                else {var asset = ticker.slice(0,-5) }}

            else if(ticker.length< 8) {var asset = ticker.slice(0,-4)}
            else {var asset = ticker.slice(0,-5)}

            var base = ticker.replace(asset+"-",'');
              

               return ({
                "type": input[0],
                "symbol_id": `COINBASE_SPOT_${asset}_${base}`,
                "sequence": ++sequence,
                "time_exchange": resp.time,
                "time_wakedapi": Date.now(),
                "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                "price": parseFloat(resp.price),
                "size": parseFloat(resp.last_size),
                "taker_side": resp.side.toUpperCase()
              })
              }
        })

    } catch (error) {
          return
    }
}

const kucoin = (evt) => {

    try {
        const resp = JSON.parse(evt.data);

        if (resp.type == "ack") return;
        if (resp == undefined) return;
        if (resp.data.price == undefined) return;
  
        ku_channels.map((ticker) => {
            if(resp.topic.indexOf(ticker) > -1 ) {

                    if(ticker.indexOf("ALGO") > -1  || ticker.indexOf("DOGE") > -1 ) {
                      if (ticker.length< 9) {var asset = ticker.slice(0,-4)} 
                      else {var asset = ticker.slice(0,-5) }}

                  else if(ticker.length< 8) {var asset = ticker.slice(0,-4)}
                  else {var asset = ticker.slice(0,-5)}



                  var base = ticker.replace(asset+"-",'');
   
                   return ({
                       "type": input[0],
                       "symbol_id": `KUCOIN_SPOT_${asset}_${base}`,
                       "sequence": ++sequence,
                       "time_exchange": resp.data.time,
                       "time_wakedapi": Date.now(),
                       "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                       "price": parseFloat(resp.data.price),
                       "size": parseFloat(resp.data.size),
                       //"taker_side": taker
                     })
                   
              }
        })

      } catch (error) {
          return
    }
}

const ftx = (evt) => {
    try {
        const resp = JSON.parse(evt.data);
        if( resp.type == "subscribed") return;
              ftx_channels.map ((ticker) => {
                  if(resp.market.indexOf(ticker) > -1 ) {
                      let initTicker = ticker

                      if (ticker.length == 7) {
                          initTicker = ticker+'a'
                      }

                      let asset = initTicker.slice(0,-5)

                      if (ticker.indexOf('DOGE') > -1) {
                            asset = 'DOGE'
                        }

                  var base = ticker.replace(asset+"/",'');

                  let weightedInput = resp.data.map((resp) => {
                    return ({price :parseFloat(resp.price), amount : parseFloat(resp.size)})
                  }) 

                  let sum = 0;
                  let price = weighted_average(weightedInput)
                    weightedInput.map ((resp) => {
                            sum += resp.amount
                  })
                  
                 return ({
                  "type": input[0],
                  "symbol_id": `FTX_SPOT_${asset}_${base}`,
                  "sequence": ++sequence,
                  "time_exchange": resp.data[0].time,
                  "time_wakedapi": Date.now(),
                  "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                  "price": price,
                  "size": sum,
                  "taker_side": resp.data[0].side.toUpperCase()
                })
              }
            })
    } catch (error) {
        return
    }
}
 */
/* const huobi = (evt) => {

    let text = pako.inflate(evt.data, {
        to: 'string'
    });

    let msg = JSON.parse(text);

    if (msg.ping) {
        huo_wss.send(JSON.stringify({
            pong: msg.ping
        }));
    } else {

    try{
    let symbol = msg.ch.split('.')[1];

    msg.tick.data.map((resp:Object) => {

      var asset = symbol.slice(0,-4).toUpperCase();
      var base = symbol.replace(asset.toLowerCase(),'').toUpperCase();

             return ({
              "type": input[0],
              "symbol_id": `HUOBIPRO_SPOT_${asset}_${base}`,
              "sequence": ++sequence,
              "time_exchange": resp.ts,
              "time_wakedapi": Date.now(),
              "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
              "price": parseFloat(resp.price),
              "size": parseFloat(resp.amount),
              "taker_side": resp.direction.toUpperCase()
            })
    })
  } catch (error) {
      return
    }
}
}

const cryptoX = (evt) => {
    try {
        const resp = JSON.parse(evt.data);
    
            if (resp.method == 'public/heartbeat') {
                //console.log("Received heartbeat, sending response")
                const message = JSON.stringify(
                        {
                            "id": resp.id,
                            "method": "public/respond-heartbeat"
                        })
                return crypto_wss.send(message);
            } else {

              for ( let i =0 ; i< resp.result.data.length; i++ ) {

              var asset = resp.result.data[0].i.slice(0, -5)
              var base = resp.result.instrument_name.replace(asset+"_",'')

                     return ({
                      "type": input[0],
                      "symbol_id": `CRYPTO_SPOT_${asset}_${base}`,
                      "sequence": ++sequence,
                      "time_exchange": resp.result.data[i].t,
                      "time_wakedapi": Date.now(),
                      "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                      "price": resp.result.data[i].p,
                      "size": resp.result.data[i].q,
                      "taker_side": resp.result.data[i].s
                    })
            }
          }
    
        } catch (error) {
            return
        }
}

const gate = (evt) => {
    const resp = JSON.parse(evt.data);

                  try{
                    resp.params[1].map( (data) => {
                      var asset = resp.params[0].slice(0, -5)
                      var base = resp.params[0].replace(asset+"_",'')

                            return ({
                              "type": input[0],
                              "symbol_id": `GATEIO_SPOT_${asset}_${base}`,
                              "sequence": ++sequence,
                              "time_exchange": data.time,
                              "time_wakedapi": Date.now(),
                              "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                              "price": parseFloat(data.price),
                              "size": parseFloat(data.amount),
                              "taker_side": data.type.toUpperCase()
                            })
                      })
    
                    } catch (error) {
                        return
                    }
} */

/* const okex = (evt) => {

    let text = pako.inflate(evt.data, {
        to: 'string',
        raw: true 
    });
    let msg = JSON.parse(text);

    if( msg.event == "subscribe") return //console.log(`OKEX Subscribing to ${msg.channel}`);

try{

  for ( let i =0 ; i<msg.data.length; i++) {
    let quantity = msg.data[i].last_qty 
    if (msg.data[i].last_qty == 0 ) quantity=0.000001

    var asset = msg.data[i].instrument_id.slice(0,-5);
    var base = msg.data[i].instrument_id.replace(asset+"-",'');

           return ({
            "type": input[0],
            "symbol_id": `OKEX_SPOT_${asset}_${base}`,
            "sequence": ++sequence,
            "time_exchange": msg.data[i].timestamp,
            "time_wakedapi": Date.now(),
            "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
            "price": parseFloat(msg.data[i].last),
            "size": parseFloat(quantity),
            "taker_side": "BUY"
          })
        }
    
  } catch (error) {
      return
    }
}

const bitfinex = (evt) => {

    let msg = JSON.parse(evt.data)

    if( msg.event == "subscribed") return //console.log(`BITFINEX Subscribing to ${msg.pair}`);
    if( msg[1] == "hb") return;
    
try{ */

  /*if (msg[1].length >1) {
     for (let i =0; i<msg[1].length; i++) {
          var pair = msg[1][i][0].slice(11);
          var asset = pair.slice(0, -3);
          var base = pair.replace(asset,'');
          if (msg[1][i][msg[1][i].length-1] > 0) {var taker = "BUY"} else {var taker = "SELL"}

                console.log({
                  "type": input[0],
                  "symbol_id": `BITFINEX_SPOT_${asset}_${base}`,
                  "sequence": ++sequence,
                  "time_exchange": msg[1][i][msg[1][i].length-3],
                  "time_wakedapi": Date.now(),
                  "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                  "price": parseFloat(msg[1][i][msg[1][i].length-2]),
                  "size": Math.abs(msg[1][i][msg[1][i].length-1]),
                  "taker_side": taker
                })
        }
      }*/
/* 
      if (msg[1] == "te") {

      var pair = msg[2].slice(11);
      var asset = pair.slice(0, -3);
      var base = pair.replace(asset,'');
      if (msg[msg.length-1] > 0) {var taker = "BUY"} else {var taker = "SELL"}

             return ({
              "type": input[0],
              "symbol_id": `BITFINEX_SPOT_${asset}_${base}`,
              "sequence": ++sequence,
              "time_exchange": msg[msg.length-3],
              "time_wakedapi": Date.now(),
              "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
              "price": parseFloat(msg[msg.length-2]),
              "size": Math.abs(msg[msg.length-1]),
              "taker_side": taker
            })
        }
  } catch (error) {
        return 
}
}

const poloniex = (evt) => {
    let msg = JSON.parse(evt.data);

    if(msg[1] == 1 ) return //console.log("Subscribing")

 try{

   for ( let i =0; i<tickerKey.length; i++) {

     if(msg[2][0] == tickerKey[i][1]) {

         var base = tickerKey[i][0].slice(0,-4);
         var asset = tickerKey[i][0].replace(asset+"_",'');

                return ({
                 "type": input[0],
                 "symbol_id": `POLONIEX_SPOT_${asset}_${base}`,
                 "sequence": ++sequence,
                 "time_exchange": undefined,
                 "time_wakedapi": Date.now(),
                 "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                 "price": parseFloat(msg[2][1]),
                 "size": undefined,
                 "taker_side": "BUY"
               })
             }
     }
 } catch (error) {
     return
}
} */

const handleIncomingMsg = (exchange:string,evt:any, channels:string[], type:string, sequence:number) => {
  let response
  if (exchange == 'BINANCE') response = binance(evt, channels, type, sequence)
  if (exchange == 'BINANCEUS') response = binanceUS(evt, channels, type, sequence)
/*   if (exchange == 'COINBASE') response = coinbase(evt, channels, type, sequence)
  if (exchange == 'KUCOIN') response = kucoin(evt, channels, type, sequence) */
  if (exchange == 'KRAKEN') response = kraken(evt, channels, type, sequence)
  if (exchange == 'BITSTAMP') response = bitstamp(evt, channels, type, sequence)
  if (exchange == 'BITSO') response = bitso(evt, channels, type, sequence)
/*   if (exchange == 'FTX') response = ftx(evt, channels, type, sequence)
  if (exchange == 'HUOBIPRO') response = huobi(evt, channels, type, sequence)
  if (exchange == 'CRYPTO') response = cryptoX(evt, channels, type, sequence)
  if (exchange == 'GATEIO') response = gate(evt, channels, type, sequence)
  if (exchange == 'OKEX') response = okex(evt, channels, type, sequence)
  if (exchange == 'BITFINEX') response = bitfinex(evt, channels, type, sequence)
  if (exchange == 'POLONIEX') response = poloniex(evt, channels, type, sequence) */
  return response
}
export default handleIncomingMsg;