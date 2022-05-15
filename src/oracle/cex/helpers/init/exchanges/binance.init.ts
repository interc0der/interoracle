

/**
 * 
 * BINANCE: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */

export const binance = (
        input:string[]) => {
  

    let channels:string[] = [];

    for (let i = 1; i<input.length; i++) {
      channels.push((input[i][2]+input[i][3]).toLowerCase());
    }

    var endpointPath = '';
        for (let i=0; i < channels.length; i++ ) {
          if (i===0) {
              endpointPath += channels[i]+"@trade";
          } else {
              endpointPath += "/"+channels[i]+"@trade";
          }
      };

    let url:string = `wss://stream.binance.com:9443/stream?streams=${endpointPath}`

    return [channels, url]
}