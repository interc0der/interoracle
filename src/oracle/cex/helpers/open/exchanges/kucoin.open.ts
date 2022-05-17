/**
 * 
 * KUCOIN: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

export const kucoin = (
  ws:WebSocket,
  channels:string[]) => {

    const message = JSON.stringify(
      { 
          "id": 1545910660739,  //The id should be an unique value
          "type": "subscribe",
          "topic": `/market/ticker:${channels}`,  //Topic needs to be subscribed. Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
          "privateChannel": false, //Adopted the private channel or not. Set as false by default.
          "response": true  //Whether the server needs to return the receipt information of this subscription or not. Set as false by default.
      }
    )
    
  return ws.send(message);
}