/**
 * 
 * BINANCEUS: Handle websocket message 
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


export const binanceUS = (
    evt:any, 
    channels:string[], 
    pairs:any, 
    type:string, 
    sequence:number,
    id:string) => {

    try{
        // Parse message from exchange
        const resp = JSON.parse(evt.data);
  
        // Handle messages that are not trades
        if (resp == undefined) return;
        if (resp.data.p == undefined) return;

        // Process trade message and return to oracle
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

            return undefined
      })

      return array.filter(Boolean)[0]
  
    } catch (error) {
      console.log(error)
          return
    }
};