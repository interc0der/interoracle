

/**
 * 
 * BITSTAMP: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const bitstamp = (
  input:string[]) => {

  let channels:string[] = [];
  for (let i = 1; i<input.length; i++) {
    channels.push((input[i][2]+input[i][3]).toLowerCase());
  }

  const url = 'wss://ws.bitstamp.net'
  
  const listenToCurrancies = channels.map(pair => {
              return ("live_trades"+"_"+pair)
  })

  return [listenToCurrancies, url]
}