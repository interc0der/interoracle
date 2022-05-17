/**
 * 
 * BITSO: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */


export const bitso = (
  ws:WebSocket,
  channels:string[]) => {

    for (let i=0; i<channels.length; i++) {
      let message = JSON.stringify({ 
        action: 'subscribe', 
        book: channels[i], 
        type: 'trades' })
  
      ws.send(message);
    };
  }