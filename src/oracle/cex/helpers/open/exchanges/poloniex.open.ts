
/**
 * 
 * POLONIEX: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

 export const poloniex = (
  ws:WebSocket,
  channels:string[]) => {

    ws.send(JSON.stringify({
      "command": "subscribe", 
      "channel": 1002
      }));
  }
  