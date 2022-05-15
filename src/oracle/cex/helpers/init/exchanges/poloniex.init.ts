
/**
 * 
 * POLONIEX: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const poloniex = async (
  input:string[]) => {

  let channels:string[] = []
  for (let i = 1; i<input.length; i++) {
    channels.push(input[i][3]+"_"+input[i][2])
  }

  let url:string = `wss://api2.poloniex.com`
              
  return [channels, url]
}