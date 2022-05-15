/**
 * 
 * BITFINEX: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const bitfinex = (
  input:string[]) => {

  let channels:string[] = []
  for (let i = 1; i<input.length; i++) {
         channels.push((input[i][2]+input[i][3]))
  }

  const url = `wss://api.bitfinex.com/ws/1`


  return [ channels, url ]
}