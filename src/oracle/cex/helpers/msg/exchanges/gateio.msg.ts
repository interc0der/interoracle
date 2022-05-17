/**
 * 
 * GATEIO: Handle websocket message 
 * 
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

export const gateio = (
    ws:WebSocket, 
    evt:any, 
    channels:string[], 
    pairs:any, 
    type:string, 
    sequence:number,
    id:string) => {
    
    // Parse message from exchange
    const resp = JSON.parse(evt.data);

    // Handle messages that are not trades

    // Process trade message and return to oracle
    try{
      let array = resp.params[1].map((data:any) => {
            var asset = resp.params[0].slice(0, -5)
            var base = resp.params[0].replace(asset+"_",'')

                return ({
                    "type": type,
                    "symbol_id": `GATEIO_SPOT_${asset}_${base}`,
                    "sequence": ++sequence,
                    "time_exchange": data.time,
                    "time_interoracle": Date.now(),
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