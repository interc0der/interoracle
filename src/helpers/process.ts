

import constants from './constants'
import { Request } from '../interface/request'
import { Interoracle } from './ws'
import init from './init'

/**
 * Initializes a empty matrix to park latest price
 * 
 * @returns { Array } RxC matrix 
 */
const createEmptyArray = (r:number, c:number, fill:any) => {
    let initArray:any = Array(r).fill(Array(r).fill([fill]))
    return initArray
}

/**
 * Handles requested pairs and returns a matrix of organized by exchange
 * 
 * @param { Object } input
 *        
 * {
    "type": "hello",
    "apikey": "THIS-IS-SAMPLE-KEY",
    "heartbeat": false,
    "subscribe_data_type": ["trade"],
    "subscribe_filter_symbol_id": subscribe_channels
    }) 
 * @returns { Array } Requested price pairs grouped by exchange
 */
const organizeByExchange = (input:Request) => {
    try{
        let type = input.type
        let key = input.apikey
        let heartBeatBoolean = input.heartbeat
        let subscribe_data_type = input.subscribe_data_type
        let rows = constants.trackedExchanges.length
        let handledArray:any[][] = createEmptyArray(rows, 4, undefined);

        for ( let i = 0; i<subscribe_data_type.length; i++) {
                let type = subscribe_data_type[i];
                for (let j =0; j<constants.trackedExchanges.length; j++) {
                    handledArray[i][j]=[type];
                }
        }
    
        if (input.subscribe_filter_symbol_id) { 
            for ( let i = 0; i<subscribe_data_type.length; i++) {
                input.subscribe_filter_symbol_id.map((index) => {
                    let inputArray = index.split("_");
                    let exchangeIndex = constants.trackedExchanges.indexOf(inputArray[0])
                    handledArray[i][exchangeIndex].push(inputArray)
                })
            } 
        }
        return handledArray

    } catch (e){
        return console.log(e)
    }
}

const initializeWS = (handledArray:any) => {
    //Subscribe to websockets TRADES
    try{
        for (let i =0; i<constants.trackedExchanges.length; i++) {
            if (handledArray[0][i].length>1 ) new Interoracle(constants.trackedExchanges[i], handledArray[0][i])
        }
    }catch(error) {
        console.log(error)
    }
}  


const instantiate = async (exchange:string, pairs:string[]) => {
    let channels:any,url:any
    if (exchange == 'BINANCE') [channels, url] = init.binance(pairs)
    if (exchange == 'BINANCEUS') [channels,url] = init.binanceUS(pairs)
    if (exchange == 'COINBASE') [channels,url] =init.coinbase(pairs)
    if (exchange == 'KUCOIN') [channels,url] = await init.kucoin(pairs)
    if (exchange == 'KRAKEN') [channels,url] = init.kraken(pairs)
    if (exchange == 'BITSTAMP') [channels,url] = init.bitstamp(pairs)
    if (exchange == 'BITSO') [channels,url] = init.bitso(pairs)
    if (exchange == 'FTX') [channels,url] = init.ftx(pairs)
    if (exchange == 'HUOBIPRO') [channels,url] = init.huobi(pairs)
    if (exchange == 'CRYPTO') [channels,url] = init.cryptoX(pairs)
    if (exchange == 'GATEIO') [channels,url] = init.gate(pairs)
    if (exchange == 'OKEX') [channels,url] = init.okex(pairs)
    if (exchange == 'BITFINEX') [channels,url] = init.bitfinex(pairs)
    if (exchange == 'POLONIEX') [channels,url] = await init.poloniex(pairs)

    return [channels,url]
}

const process = {
    createEmptyArray,
    organizeByExchange,
    initializeWS,
    instantiate
}

export default process