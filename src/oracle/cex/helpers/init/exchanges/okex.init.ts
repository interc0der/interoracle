

/**
 * 
 * OKEX: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const okex = (
  input:string[]) => {

  let channels:string[] = []
  for (let i = 1; i<input.length; i++) {
        channels.push((input[i][2]+"-"+input[i][3]))
  }

  let url:string = `wss://ws.okx.com:8443/ws/v5/public`

  return [channels, url]
}