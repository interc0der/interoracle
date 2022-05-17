/**
 * 
 * KRAKEN: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

export const kraken = (
  ws:WebSocket,
  channels:string[]) => {

    const message = JSON.stringify({
      "event": "subscribe",
      "pair": channels,
      "subscription": {
        "name": "trade"
      }
    })
  
    return ws.send(message);
}