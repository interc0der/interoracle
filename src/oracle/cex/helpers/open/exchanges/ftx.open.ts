/**
 * 
 * FTX: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

export const ftx = (
  ws:WebSocket,
  channels:string[]) => {

    for (let i=0; i<channels.length; i++) {
      const message = JSON.stringify(
        {'op': 'subscribe', 
        'channel': 'trades', 
        'market': channels[i]
    })
    
    ws.send(message);
  }
}