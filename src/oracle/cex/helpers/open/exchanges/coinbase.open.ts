/**
 * 
 * COINBASE: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

export const coinbase = (
  ws:WebSocket,
  channels:string[]) => {

    const message = JSON.stringify(
      {
          "type": "subscribe",
          "channels": [{ "name": "ticker", "product_ids": channels }]
      }
    )
    return ws.send(message);
}