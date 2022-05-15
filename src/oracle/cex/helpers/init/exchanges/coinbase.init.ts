

/**
 * 
 * COINBASE: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const coinbase = (
  input:string[]) => {

  let channels:string[] = [];
  for (let i = 1; i<input.length; i++) {
    channels.push(input[i][2]+"-"+input[i][3]);
  }
  let url:string = 'wss://ws-feed.pro.coinbase.com';


  return [channels, url]
}