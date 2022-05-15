


/**
 * 
 * GATEIO: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const gate = (
  input:string[]) => {

  let channels:string[] = [] = []
  for (let i = 1; i<input.length; i++) {
        channels.push((input[i][2]+"_"+input[i][3]))
  }

  let url:string = `wss://ws.gate.io/v4`

  return [channels, url]
}
