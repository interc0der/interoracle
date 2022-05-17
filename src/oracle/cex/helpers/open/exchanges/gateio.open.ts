/**
 * 
 * GATEIO: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

export const gateio = (
  ws:WebSocket,
  channels:string[]) => {

    var msg = {
      id: 1234,
      method: 'trades.subscribe',
      params: channels
    };
    ws.send(JSON.stringify(msg));
};