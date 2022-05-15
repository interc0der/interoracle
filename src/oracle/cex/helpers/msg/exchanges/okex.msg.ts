/**
 * 
 * OKEX: Handle websocket message 
 * 
 * 
 * @param {any} evt - unaltered event for exchange websocket 
 * @param {array} channels - array of exchange pairs (exchange format)
 * @param {array} pairs - array of exchange pairs (interoracle format)
 * @param {string} type  - type of exchange response 
 * @param {number} sequence  - exchange specific counter number
 * @param {string} id  - user assigned uuid 
 * @returns 
 */

export const okex = (
    evt:any, 
    channels:string[], 
    pairs:any, 
    type:string, 
    sequence:number,
    id:string ) => {

    // Parse message from exchange
    let msg = JSON.parse(evt.data)

    // Handle messages that are not trades
    if( msg.event == "error") return console.log(`OKEX Error: ${msg.msg}`);
    if( msg.event == "subscribe") return //console.log(`OKEX Subscribing to ${msg.channel}`);

    // Process trade message and return to oracle
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
