/**
 * 
 * CRYPTO: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

export const crypto = (
    ws:WebSocket,
    channels:string[]) => {
  
    const message = JSON.stringify(
        {
            "id": 11,
            "method": "subscribe",
            "params": {
                "channels": channels
            },
            "nonce": 1587523073344
            }
    )
    
    return ws.send(message);
}