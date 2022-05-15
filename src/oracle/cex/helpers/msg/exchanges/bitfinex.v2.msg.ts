/* interface IBitfinexTradeRepsonse {
    [
        [
            CHANNEL_ID: number
            ID:string // 'te' (trade executed), 'tu' (trade execution update)
            SYMBOL: //
        ]
      ]
     
}
 */

/* // request
{
    "event": "subscribe",
    "channel": CHANNEL_NAME
 }
 
 // response
 {
    "event": "subscribed",
    "channel": CHANNEL_NAME,
    "chanId": CHANNEL_ID
 }
 
 // response-failure
 {
    "event": "error",
    "msg": ERROR_MSG,
    "code": ERROR_CODE
 }

 //Info message

 {
    "event": "info",
    "version":  VERSION,
    "platform": {
       "status": 1
    }
 }

 {
    "event":"info",
    "code": CODE,
    "msg": MSG
 }


 // request
{
    "event":"ping",
    "cid": 1234
 }
 
 // response
 {
    "event":"pong",
    "ts": 1511545528111,
    "cid": 1234
 }

 [ CHANNEL_ID, "hb" ]

 */

// All trading pairs
// https://api-pub.bitfinex.com/v2/conf/pub:list:pair:exchange

/**
 * 
 * Bitfinex: Handle websocket message 
 * https://docs.bitfinex.com/docs/ws-general
 * 
 * @param {any} evt - unaltered event for exchange websocket 
 * @param {any} evt - unaltered event for exchange websocket 
 * @param {array} channels - array of exchange pairs (exchange format)
 * @param {array} pairs - array of exchange pairs (interoracle format)
 * @param {string} type  - type of exchange response 
 * @param {number} sequence  - exchange specific counter number
 * @param {string} id  - user assigned uuid 
 * @returns 
 */

export const bitfinex = (
    evt:any, 
    channels:string[], 
    pairs:any, 
    type:string, 
    sequence:number,
    id:string) => {

    // Parse message from exchange
    let msg = JSON.parse(evt.data)

    // Handle messages that are not trades
    if( msg.event == "subscribed") return //console.log(`BITFINEX Subscribing to ${msg.pair}`);
    if( msg[1] == "hb") return;
  
    // Process trade message and return to oracle
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
        return undefined

  } catch (error) {
    console.log(error)
        return 
}
}