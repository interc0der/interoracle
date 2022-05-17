interface IBitstampTradeRepsonse {
    id: number, //  Trade unique ID.
    amount?: number, // Trade amount.
    amount_str?: string, // Trade amount represented in string format.
    price?: number, // Trade price.
    price_str?: string, // Trade price represented in string format.
    type?: string, // Trade type (0 - buy; 1 - sell).
    timestamp?: string, // Trade timestamp.
    microstamp?: string, // Trade microtimestamp.
    buy_order_id?: number, // Trade buy order ID.
    sell_order_id?: number, // Trade sell order ID.
}

// Available channels as of 05/14/2022
const availableChannels = [
'btcusd', 'btceur', 'btcgbp', 'btcpax', 'gbpusd', 'gbpeur', 'eurusd', 'xrpusd', 'xrpeur', 'xrpbtc', 'xrpgbp', 'xrppax', 'ltcbtc', 'ltcusd', 'ltceur', 'ltcgbp', 'ethbtc', 
'ethusd', 'etheur', 'ethgbp', 'ethpax', 'bchusd', 'bcheur', 'bchbtc', 'bchgbp', 'paxusd', 'paxeur', 'paxgbp', 'xlmbtc', 'xlmusd', 'xlmeur', 'xlmgbp', 'linkusd', 'linkeur', 'linkgbp', 'linkbtc', 
'linketh', 'omgusd', 'omgeur', 'omggbp', 'omgbtc', 'usdcusd', 'usdceur', 'btcusdc', 'ethusdc', 'eth2eth', 'aaveusd', 'aaveeur', 'aavebtc', 'batusd', 'bateur', 'batbtc', 'umausd', 'umaeur', 'umabtc', 
'daiusd', 'kncusd', 'knceur', 'kncbtc', 'mkrusd', 'mkreur', 'mkrbtc', 'zrxusd', 'zrxeur', 'zrxbtc', 'gusdusd', 'algousd', 'algoeur', 'algobtc', 'audiousd', 'audioeur', 'audiobtc', 'crvusd', 'crveur', 
'crvbtc', 'snxusd', 'snxeur', 'snxbtc', 'uniusd', 'unieur', 'unibtc', 'yfiusd', 'yfieur', 'yfibtc', 'compusd', 'compeur', 'compbtc', 'grtusd', 'grteur', 'usdtusd', 'usdteur', 'usdcusdt', 'btcusdt', 
'ethusdt', 'xrpusdt', 'eurteur', 'eurtusd', 'maticusd', 'maticeur', 'sushiusd', 'sushieur', 'chzusd', 'chzeur', 'enjusd', 'enjeur', 'hbarusd', 'hbareur', 'alphausd', 'alphaeur', 'axsusd', 'axseur',
'fttusd', 'ftteur', 'sandusd', 'sandeur', 'storjusd', 'storjeur', 'adausd', 'adaeur', 'adabtc', 'fetusd', 'feteur', 'rgtusd', 'rgteur', 'sklusd', 'skleur', 'celusd', 'celeur', 'slpusd', 'slpeur', 
'sxpusd', 'sxpeur', 'sgbusd', 'sgbeur', 'avaxusd', 'avaxeur', 'dydxusd', 'dydxeur', 'ftmusd', 'ftmeur', 'ampusd', 'ampeur', 'galausd', 'galaeur', 'perpusd', 'perpeur', 'wbtcbtc', 'ctsiusd', 'ctsieur', 
'cvxusd', 'cvxeur', 'imxusd', 'imxeur', 'nexousd', 'nexoeur', 'ustusd', 'usteur', 'antusd', 'anteur', 'godsusd', 'godseur', 'radusd', 'radeur'] 

/**
 * 
 * Bitstamp: Handle websocket message 
 * https://www.bitstamp.net/websocket/v2/
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

export const bitstamp = (
    ws:WebSocket, 
    evt:any, 
    channels:string[], 
    pairs:any, 
    type:string, 
    sequence:number,
    id:string) => {
   
    try {

        // Parse message from exchange
        const resp = JSON.parse(evt.data);
  
        // Handle messages that are not trades
        if (resp == undefined) return;
        if (resp.data.price == undefined) return;

        // Process trade message and return to oracle
        let array = channels.map((ticker:any, index:number) => {
            if( resp.channel == ticker) {
                let channel = pairs[index+1]
                let symbol = channel.join('_')

                return ({
                        "type": type,
                        "symbol_id": symbol,
                        "sequence": ++sequence,
                        "time_exchange": parseFloat(resp.data.microtimestamp),
                        "time_interoracle": Date.now(),
                        "uuid": id,
                        "price": resp.data.price,
                        "size": resp.data.amount,
                        "taker_side": "BUY"
                    })
                }
                
                return undefined
          })

          return array.filter(Boolean)[0]

      } catch (error) {
        console.log(error)
        return
    }
}


