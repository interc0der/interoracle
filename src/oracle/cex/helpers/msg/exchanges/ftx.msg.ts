import utils from '../../utils';
import { PriceArrayType } from 'types/request';

/**
 * 
 * FTX: Handle websocket message 
 * 
 * 
 * @param {any} evt - unaltered event for exchange websocket 
 * @param {any} evt - unaltered event for exchange websocket 
 * @param {array} channels - array of exchange pairs (exchange format)
 * @param {array} pairs - array of exchange pairs (interoracle format)
 * @param {string} type  - type of exchange response 
 * @param {number} sequence  - exchange specific counter number
 * @param {string} id  - user assigned uuid 
 * @returns 
 */

export const ftx = (
  ws:WebSocket, 
  evt:any, 
  channels:string[], 
  pairs:any, 
  type:string, 
  sequence:number,
  id:string) => {

    // Parse message from exchange
    const resp = JSON.parse(evt.data);

    // Handle messages that are not trades
    if( resp.type == "subscribed") return;
    if( resp.type == "error") {
        console.log('FTX:', resp)
        return
    };

    // Process trade message and return to oracle
    try {
        let array = channels.map((ticker:string) => {

          if(resp.market.indexOf(ticker) > -1 ) {
            let asset

            if (ticker.includes('USDT')
            || ticker.includes('USDC')
            || ticker.includes('BUSD')
            ) {
              asset = ticker.slice(0,-5)
            } else {
              asset = ticker.slice(0,-4)
            }
                    
            let base = ticker.replace(asset+"/",'');

            let weightedInput = resp.data.map((resp:any) => {
              return { price: parseFloat(resp.price), amount: parseFloat(resp.size) }
            }) 

            let sum = 0;
            let price = utils.weighted_average(weightedInput)
            weightedInput.map((resp: PriceArrayType) => {
                sum += resp.amount
            })

            return ({
                "type": type,
                "symbol_id": `FTX_SPOT_${asset}_${base}`,
                "sequence": ++sequence,
                "time_exchange": new Date(resp.data[0].time).getTime(),
                "time_interoracle": Date.now(),
                "uuid": id,
                "price": price,
                "size": sum,
                "taker_side": resp.data[0].side.toUpperCase()
            })
        }
        return 
      })
      return array.filter(Boolean)[0]
    } catch (error) {
      console.log(error)
        return
    }
}