import { PriceArrayType, GrossPriceArrayType } from "types/request";
import constants from './constants'
import { Request } from 'types/request'
import Interoracle from '../interoracle'
import axios from 'axios'

/**
 * Initializes a empty matrix to park latest price
 * 
 * @returns { Array } RxC matrix  
 */
 const createEmptyArray = (r:number, c:number, fill:any): Array<any> => {
    let initArray:any[][] = []

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
        let handledArray:(string|string[])[][] = utils.createEmptyArray(1,rows, undefined);
    
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
const organizeByCurrency = (input:Request) => {
    try{
        if (!input.subscribe_filter_symbol_id) return
        let block:string[] = []

        let currenciesArray:(string | undefined)[] = input.subscribe_filter_symbol_id
            .map((ticker) => {
                let currency = ticker.split('_')[2]
                if (block.indexOf(currency) == -1) {
                    block.push(currency)
                    return currency } })
            .filter(Boolean)

        if (!currenciesArray || currenciesArray.length == 0) return 

        let obj={}
        currenciesArray.forEach((currency) => {
            if (!currency) return
            obj[currency]=[]
            input.subscribe_filter_symbol_id.forEach((ticker)=> {
                if (currency == ticker.split('_')[2]) obj[currency].push(ticker)
            })
        })
        return obj
    } catch (e){
        return console.log(e)
    }
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

/**
 * 
 * Process grouped price data feeds and condense down to single entry
 * 
 * @param {Array} input // Array of prices, trade amounts, assigned weights, timestamps
 * @returns {number} // Weighted average price based on trade amount, user assigned weights, and (optional) time decay
 */
const gross_weighted_average_price = (input:GrossPriceArrayType[]) => {
    var weights:any = [];
    var values:any = [];
    var weighted_total = 0;
    var total_value = 0;
    var decay = 10000000; 
    //if staleTime = 2000 ms, max reduction == 0.770
    //if staleTime = 5000 ms, max reduction == 0.630
    //if staleTime = 10000 ms, max reduction == 0.400


    for (var i = 0; i < input.length; i++) {
        weights.push(
            input[i].price * 
            input[i].amount * 
            //((parseFloat(input[i].time)/parseFloat(input[input.length-1].time))**decay) *  //Ratio of timestamps, linear decay
            input[i].weight //Takes into account weight of exchange between 0 and 1
        );
        
        values.push(
            input[i].amount * 
            //((parseFloat(input[i].time)/parseFloat(input[input.length-1].time))**decay) * //Ratio of timestamps, linear decay
            input[i].weight //Takes into account weight of exchange between 0 and 1
        );
    }

    for (var i = 0; i < weights.length; i++) {
        weighted_total += weights[i];
        total_value += values[i];
    }

    return weighted_total / total_value;
}


/**
 * 
 * Process grouped price data feeds and condense down to single entry
 * 
 * @param {Array} input // Array of prices and trade amounts
 * @returns {number} //Weighted average price based on trade amount
 */
const weighted_average = (input:PriceArrayType[]) => {
    var weights:any = [];
    var values:any = [];
    var weighted_total = 0;
    var total_value = 0;
  
  
    for (var i = 0; i < input.length; i++) {
        weights.push((input[i].price) * input[i].amount);
        values.push(input[i].amount);
    }
  
    for (var i = 0; i < weights.length; i++) {
        weighted_total += weights[i];
        total_value += values[i];
    }
  
    return weighted_total / total_value;
  }

  const utils = {
      createEmptyArray,
      weighted_average,
      gross_weighted_average_price,
      organizeByExchange,
      organizeByCurrency,
      getPairIndices,
      getTickers
  }

  export default utils;



