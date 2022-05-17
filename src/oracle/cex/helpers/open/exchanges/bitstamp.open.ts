/**
 * 
 * BITSTAMP: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

 export const bitstamp = (
  ws:WebSocket,
  channels:string[]) => {

    for (let i = 0; i<channels.length; i++){
      const message = JSON.stringify({ 
        "event": "bts:subscribe",
        "data": {
            "channel": channels[i]
        }})

      ws.send(message);
  };
}