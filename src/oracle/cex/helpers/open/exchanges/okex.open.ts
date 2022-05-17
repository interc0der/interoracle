/**
 * 
 * OKEX: Process websocket url and trade channels
 * 
 * @param {WebSocket} ws - Exchange socket for sending request
 * @param {string[]} channels - Array of exchange pairs (interoracle format)
 * @returns blank
 */

export const okex = (
  ws:WebSocket,
  channels:string[]) => {

    let args:any = []
    for (let symbol of channels) {
      args.push({
        "channel": "trades",
        "instId": symbol
      })
    }
  
    return ws.send(JSON.stringify({
        "op": "subscribe",
        "args": args
  })) 
}