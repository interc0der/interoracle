

/**
 * 
 * HUOBI: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */


export const huobi = (
  input:string[]) => {

  let channels:string[] = [] 
  for (let i = 1; i<input.length; i++) {
    channels.push((input[i][2]+input[i][3]).toLowerCase());
  }

  let url:string = `wss://api.huobi.pro/ws`

  return [channels, url]
}
