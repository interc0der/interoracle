interface IBitsoTradeRepsonse {
    type: string, // type
    book?: string, // book
    payload?: [
      {
        i: number, // A unique number identifying the transaction
        a: string, // Amount
        r: string, // Rate
        v: string, // Value
        mo: string, // Maker Order ID
        to: string, // Taker Order ID
        t: number // Maker side, 0 indicates buy 1, indicates sell
      }
    ]
}
  
interface IBitsoServerRepsonse {
    type: string // 'trades'
    action?: string, // 'subscribe'
    response?: string, // 'subscribe'
    time?: number, // 1652556518701
}

interface IBitsoKeepAlive {
    type: string // 'ka' 
}

type IBitsoResponse = IBitsoTradeRepsonse | IBitsoServerRepsonse | IBitsoKeepAlive



/**
 * 
 * Bitso: Handle websocket message 
 * https://bitso.com/api_info#trades-channel
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


export const bitso = (
      evt:any, 
      channels:string[], 
      pairs:any, 
      type:string, 
      sequence:number,
      id:string) => {

      try {
          // Parse message from exchange
          const resp:IBitsoResponse = JSON.parse(evt.data);

          // Handle messages that are not trades
          if (resp == undefined) return;
          if ("action" in resp && resp.action == "subscribe") return;
          if (resp.type == "ka") return;
  
          // Process trade message and return to oracle
          let array = channels.map((ticker:any, index:number) => {
                if( "book" in resp 
                    && resp.book 
                    && resp.book.indexOf(ticker) > -1 ) {
                    let channel = pairs[index+1]
                    let symbol = channel.join('_')
    
                    var taker = "SELL"
                    var price, size
                    if( "payload" in resp 
                        && resp.payload
                        && resp.payload[0].t == 0) taker = "BUY"
        
                    if( "payload" in resp 
                        && resp.payload ) { 
                        price = parseFloat(resp.payload[0].r)
                        size = parseFloat(resp.payload[0].a)
                        }
    
                    return ({
                        "type": type,
                        "symbol_id": symbol,
                        "sequence": ++sequence,
                        "time_exchange": undefined,
                        "time_wakedapi": Date.now(),
                        "uuid": id,
                        "price": price,
                        "size": size,
                        "taker_side": taker
                    })
                }
                return undefined
          })
  
          return array.filter(Boolean)[0]
  
        } catch (error) {
            return
      }
  }