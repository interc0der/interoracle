

/**
 * 
 * KRAKEN: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const kraken = (
  input:any[]) => {

  let channels:string[] = [];
  for (let i = 1; i<input.length; i++) {

    if (input[i][2] == "BTC") { input[i][2]="XBT" }
    if (input[i][2] == "DOGE") { input[i][2]="XDG" }

    channels.push(input[i][2]+"/"+input[i][3]);
  }

  let url:string = 'wss://ws.kraken.com';

  return [channels, url]
}