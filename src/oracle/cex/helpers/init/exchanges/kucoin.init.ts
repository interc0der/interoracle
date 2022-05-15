import axios from 'axios'

/**
 * 
 * KUCOIN: Process websocket url and trade channels
 * 
 * @param {array} input - Array of exchange pairs (interoracle format)
 * @returns 
 */
export const kucoin = async (input:string[]) => {

  let channels:string[] = [];
  for (let i = 1; i<input.length; i++) {
    channels.push(input[i][2]+"-"+input[i][3]);
  }

  let auth_url = "https://api.kucoin.com/api/v1/bullet-public"
        
  async function init () {
      const resp = await axios.post ( auth_url ) ;
      return resp.data.data.token
  }

  let authkey = await init();
  let connectId = 1545910660739
      
  let url:string = `wss://ws-api.kucoin.com/endpoint?token=${authkey}&[connectId=${connectId}]`;
      
  return [channels, url]
}