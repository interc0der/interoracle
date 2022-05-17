/**
 * 
 * BITFINEX: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

export const bitfinex = (
  ws:WebSocket,
  channels:string[]) => {

    for (let symbol of channels) {
      ws.send(JSON.stringify({
        "event": "subscribe",
        "channel": "trades",
        "pair": symbol
        }));
    }
  }