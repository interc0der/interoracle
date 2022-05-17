/**
 * 
 * KUCOIN: Handle websocket message 
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

export const kucoin = (
    ws:WebSocket, 
    evt:any, 
    channels:string[], 
    pairs:any, 
    type:string, 
    sequence:number,
    id:string ) => {

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
                    "taker_side": undefined
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