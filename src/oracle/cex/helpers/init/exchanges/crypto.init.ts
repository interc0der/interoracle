
/**
 * 
 * CRYPTO: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const crypto = (
    input:string[]) => {

    let channels:string[] = []
    for (let i = 1; i<input.length; i++) {
          channels.push((input[i][2]+"_"+input[i][3]))
    }
    let url:string = 'wss://stream.crypto.com/v2/market';
    let handledChannel = channels.map(ticker => {return `trade.${ticker}`} )
    
    return [handledChannel, url]
}
