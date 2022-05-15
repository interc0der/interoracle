import utils from '../utils';
import { PriceArrayType } from 'types/request';

/**
 * 
 * Kraken: Handle websocket message 
 * 
 * 
 * @param {any} evt - unaltered event for exchange websocket 
 * @param {array} channels - array of exchange pairs (exchange format)
 * @param {array} pairs - array of exchange pairs (interoracle format)
 * @param {string} type  - type of exchange response 
 * @param {number} sequence  - exchange specific counter number
 * @param {string} id  - user assigned uuid 
 * @returns 
 */

export const kraken = (
    evt:any, 
    channels:string[], 
    pairs:any, 
    type:string, 
    sequence:number,
    id:string) => {

    try {
        const resp = JSON.parse(evt.data);
  
        if( resp.event == "heartbeat") return;
        if( resp.event == "systemStatus") return;
        if( resp.event == "subscriptionStatus") return;

        let array = channels.map((ticker:any, index:number) => {
          if( resp[3].indexOf(ticker) > -1 ) {
            let channel = pairs[index+1]
            let symbol = channel.join('_')

                let taker;
                if (resp[1][0][3] == "b") taker = "BUY" 
                if (resp[1][0][3] != "b") taker = "SELL"

                let weightedInput = resp[1].map((resp:any) => {
                    return ({
                      price: parseFloat(resp[0]), 
                      amount: parseFloat(resp[1])
                    })
                }) 

                let sum = 0;
                let price = utils.weighted_average(weightedInput)

                weightedInput.map((resp:PriceArrayType) => {
                        sum += resp.amount
                })
                
                return ({
                    "type": type,
                    "symbol_id": symbol,
                    "sequence": ++sequence,
                    "time_exchange": resp[1][0][2],
                    "time_interoracle": Date.now(),
                    "uuid": id,
                    "price": price,
                    "size": sum,
                    "taker_side": taker
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
