/**
 * 
 * Poloniex: Handle websocket message 
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

export const poloniex = (
        tickers: string[][], 
        evt:any, 
        channels:string[], 
        pairs:any, 
        type:string, 
        sequence:number,
        id:string) => {

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
 