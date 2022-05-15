import pako from 'pako';

/**
 * 
 * Huobi: Handle websocket message 
 * 
 * 
 * @param {any} ws - websocket client
 * @param {any} evt - unaltered event for exchange websocket 
 * @param {any} evt - unaltered event for exchange websocket 
 * @param {array} channels - array of exchange pairs (exchange format)
 * @param {array} pairs - array of exchange pairs (interoracle format)
 * @param {string} type  - type of exchange response 
 * @param {number} sequence  - exchange specific counter number
 * @param {string} id  - user assigned uuid 
 * @returns 
 */


export const huobi = (
    ws: any, 
    evt:any, 
    channels:string[], 
    pairs:any, 
    type:string, 
    sequence:number,
    id:string) => {

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