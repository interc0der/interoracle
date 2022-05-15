

/**
 * 
 * BITSO: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const bitso = (
  input:string[]) => {

  let channels:string[] = [];
  for (let i = 1; i<input.length; i++) {
    channels.push((input[i][2]+"_"+input[i][3]).toLowerCase());
  }

  let url:string = `wss://ws.bitso.com`

  return [channels, url]
}