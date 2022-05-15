/**
 * 
 * CRYPTO: Handle websocket message 
 * https://www.bitstamp.net/websocket/v2/
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
export const crypto = (
    ws:any, 
    evt:any, 
    channels:string[], 
    pairs:any, 
    type:string, 
    sequence:number,
    id:string) => {

    try {
        // Parse message from exchange
        const resp = JSON.parse(evt.data);
    
        // Handle messages that are not trades
        if (resp.method == 'public/heartbeat') {
                const message = JSON.stringify({
                        "id": resp.id,
                        "method": "public/respond-heartbeat"
                    })

            return ws.send(message);
        }

        // Process trade message and return to oracle
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