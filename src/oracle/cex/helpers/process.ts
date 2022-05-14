

import constants from './constants'
import { Request } from '../../../../types/request'
import { Interoracle } from './ws'
import init from './init'
import axios from 'axios'

/**
 * Initializes a empty matrix to park latest price
 * 
 * @returns { Array } RxC matrix  
 */
const createEmptyArray = (r:number, c:number, fill:any) => {
    let initArray:any= []

    for (let i=0; i<c; i++) {
        let row:any = []
        for (let j=0; j<r; j++) {
            row.push(fill)
        }
        initArray.push(row)
    }
    
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
        let handledArray:any[][] = createEmptyArray(1,rows, undefined);
   
        for (let j =0; j<constants.trackedExchanges.length; j++) {
            handledArray[j][0]=input.subscribe_data_type[0];
        }

        if (input.subscribe_filter_symbol_id) { 
            for ( let i = 0; i<subscribe_data_type.length; i++) {
                input.subscribe_filter_symbol_id.forEach((pair) => {
                    let inputArray = pair.split("_");
                    let exchangeIndex = constants.trackedExchanges.indexOf(inputArray[0])
                    handledArray[exchangeIndex].push(inputArray)
                })
            } 
        }

        return handledArray

    } catch (e){
        return console.log(e)
    }
}

const initializeWS = (peer:any, channels:any, handledArray:any) => {
    //Subscribe to websockets TRADES
    try{
        for (let i =0; i<constants.trackedExchanges.length; i++) {
            if (handledArray[i].length>1 ) new Interoracle(peer, constants.trackedExchanges[i], channels, handledArray[i])
        }

        for (let i =0; i<constants.trackedCurrencies.length; i++) {
            Interoracle.prototype[constants.trackedCurrencies[i]] = createEmptyArray(30, 3, undefined)
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

const getPairIndices = async (channels:string[], pairs:any) => {

     let process = pairs.map((pair:string[], index:number) => {
        if (index==0) return
        return pair.join("_")
    }).filter(Boolean)

    let xrpChannels = channels.map((channel) => {if (channel.indexOf("XRP") > -1) {return channel} else return }).filter(Boolean)
    let ltcChannels = channels.map((channel) => {if (channel.indexOf("LTC") > -1) {return channel} else return }).filter(Boolean)
    let adaChannels = channels.map((channel) => {if (channel.indexOf("ADA") > -1) {return channel} else return }).filter(Boolean)
    let algoChannels = channels.map((channel) => {if (channel.indexOf("ALGO") > -1) {return channel} else return }).filter(Boolean)
    let btcChannels = channels.map((channel) => {if (channel.indexOf("BTC") > -1) {return channel} else return }).filter(Boolean)
    let ethChannels = channels.map((channel) => {if (channel.indexOf("ETH") > -1) {return channel} else return }).filter(Boolean)
    let bchChannels = channels.map((channel) => {if (channel.indexOf("BCH") > -1) {return channel} else return }).filter(Boolean)
    let dogeChannels = channels.map((channel) => {if (channel.indexOf("DOGE") > -1) {return channel} else return }).filter(Boolean)
    let xlmChannels = channels.map((channel) => {if (channel.indexOf("XLM") > -1) {return channel} else return }).filter(Boolean)
    let dgbChannels = channels.map((channel) => {if (channel.indexOf("DGB") > -1) {return channel} else return }).filter(Boolean)
    let filChannels = channels.map((channel) => {if (channel.indexOf("FIL") > -1) {return channel} else return }).filter(Boolean)
    
    let escapeRegExpMatch = (s:string) => {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      };

    let isExactMatch = (str:string, match:string) => {
      return new RegExp(`\\b${escapeRegExpMatch(match)}\\b`).test(str)
      }

    let array:number[] = []
    channels.forEach((channel:string) => {
        process.forEach((pair:string) => {
            if (isExactMatch(channel, pair) == true) {
                if (channel.indexOf("XRP")> -1) array.push(xrpChannels.indexOf(channel))
                if (channel.indexOf("LTC")> -1) array.push(ltcChannels.indexOf(channel))
                if (channel.indexOf("BTC")> -1) array.push(btcChannels.indexOf(channel))
                if (channel.indexOf("ETH")> -1) array.push(ethChannels.indexOf(channel))
                if (channel.indexOf("XLM")> -1) array.push(xlmChannels.indexOf(channel))
                if (channel.indexOf("ADA")> -1) array.push(adaChannels.indexOf(channel))
                if (channel.indexOf("ALGO")> -1) array.push(algoChannels.indexOf(channel))
                if (channel.indexOf("DGB")> -1) array.push(dgbChannels.indexOf(channel))
                if (channel.indexOf("BCH")> -1) array.push(bchChannels.indexOf(channel))
                if (channel.indexOf("FIL")> -1) array.push(filChannels.indexOf(channel))
                if (channel.indexOf("DOGE")> -1) array.push(dogeChannels.indexOf(channel))
              }
        })
    })
    return [process, array]
}


const getTickers = async (channels:string[]) => {

    let poloniex_api = "https://poloniex.com/public?command=returnTicker"
    let poloniex_id = await axios.get ( poloniex_api ) ;
    let idArray = Object.entries(poloniex_id.data);
  
    let tickerKey:string[][] = channels.map((ticker:string) => {
            let index:any = idArray.find((entry) => entry[0] == ticker)
            let returnData:string[] = []
            if (index == undefined ) returnData = [ticker, '']
            if (index != undefined ) returnData = [ticker, index[1].id]
            return returnData
    })
  
   return tickerKey
}

export default {
    createEmptyArray,
    organizeByExchange,
    initializeWS,
    instantiate,
    getPairIndices,
    getTickers
}
