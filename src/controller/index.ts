import { WebSocket } from 'ws';
import pako, {DeflateOptions, DeflateFunctionOptions, InflateFunctionOptions, Inflate, InflateOptions} from 'pako';
import { times, indexOf } from 'lodash';


import { Request, Response, NextFunction, response} from 'express'
import { Inflate } from 'zlib';

const subscribe_channels = [

  // XRP Enabled Exchanges
  "BINANCE_SPOT_XRP_USDT",
  //"BINANCE_SPOT_XRP_BUSD",
  //"BINANCE_SPOT_XRP_USDC",
  "BINANCEUS_SPOT_XRP_USDT",
  //"BINANCEUS_SPOT_XRP_BUSD",
  //"BINANCEUS_SPOT_XRP_USDC",
  "KUCOIN_SPOT_XRP_USDT",
  "GATEIO_SPOT_XRP_USDT",
  "HUOBIPRO_SPOT_XRP_USD" ,
  "HUOBIPRO_SPOT_XRP_USDT" ,
  "FTX_SPOT_XRP_USD" ,
  "FTX_SPOT_XRP_USDT" ,
  "KRAKEN_SPOT_XRP_USD" ,
  "BITSTAMP_SPOT_XRP_USD" ,
  "BITFINEX_SPOT_XRP_USD" ,
  "BITFINEX_SPOT_XRP_USDT" ,
  "POLONIEX_SPOT_XRP_USDT" ,
  //"POLONIEX_SPOT_XRP_USDC" ,
  "BITSO_SPOT_XRP_USD" ,
  "CRYPTO_SPOT_XRP_USDT" ,
  //"CRYPTO_SPOT_XRP_USDC" ,
  "OKEX_SPOT_XRP_USD",
  "OKEX_SPOT_XRP_USDT",
  //"OKEX_SPOT_XRP_USDC",
  "COINBASE_SPOT_XRP_USD" ,

  // LTC Enabled Exchanges
  "BINANCE_SPOT_LTC_USDT",
  //"BINANCE_SPOT_LTC_BUSD",
  //"BINANCE_SPOT_LTC_USDC",
  "BINANCEUS_SPOT_LTC_USDT",
  //"BINANCEUS_SPOT_LTC_BUSD",
  //"BINANCEUS_SPOT_LTC_USDC",
  "KUCOIN_SPOT_LTC_USDT",
  "GATEIO_SPOT_LTC_USDT",
  "HUOBIPRO_SPOT_LTC_USD" ,
  "HUOBIPRO_SPOT_LTC_USDT" ,
  "FTX_SPOT_LTC_USD" ,
  "FTX_SPOT_LTC_USDT" ,
  "KRAKEN_SPOT_LTC_USD" ,
  "BITSTAMP_SPOT_LTC_USD" ,
  "BITFINEX_SPOT_LTC_USD" ,
  "BITFINEX_SPOT_LTC_USDT" ,
  "POLONIEX_SPOT_LTC_USDT" ,
  //"POLONIEX_SPOT_LTC_USDC" ,
  "BITSO_SPOT_LTC_USD" ,
  "CRYPTO_SPOT_LTC_USDT" ,
  //"CRYPTO_SPOT_LTC_USDC" ,
  "OKEX_SPOT_LTC_USD",
  "OKEX_SPOT_LTC_USDT",
  //"OKEX_SPOT_LTC_USDC",
  "COINBASE_SPOT_LTC_USD" ,

  // XLM Enabled Exchanges
  "BINANCE_SPOT_XLM_USDT",
  //"BINANCE_SPOT_XLM_BUSD",
  //"BINANCE_SPOT_XLM_USDC",
  "BINANCEUS_SPOT_XLM_USDT",
  //"BINANCEUS_SPOT_XLM_BUSD",
  //"BINANCEUS_SPOT_XLM_USDC",
  "KUCOIN_SPOT_XLM_USDT",
  "GATEIO_SPOT_XLM_USDT",
  "HUOBIPRO_SPOT_XLM_USD" ,
  "HUOBIPRO_SPOT_XLM_USDT" ,
  "FTX_SPOT_XLM_USD" ,
  "FTX_SPOT_XLM_USDT" ,
  "KRAKEN_SPOT_XLM_USD" ,
  "BITSTAMP_SPOT_XLM_USD" ,
  "BITFINEX_SPOT_XLM_USD" ,
  "BITFINEX_SPOT_XLM_USDT" ,
  "POLONIEX_SPOT_XLM_USDT" ,
  //"POLONIEX_SPOT_XLM_USDC" ,
  "BITSO_SPOT_XLM_USD" ,
  "CRYPTO_SPOT_XLM_USDT" ,
  //"CRYPTO_SPOT_XLM_USDC" ,
  "OKEX_SPOT_XLM_USD",
  "OKEX_SPOT_XLM_USDT",
  //"OKEX_SPOT_XLM_USDC",
  "COINBASE_SPOT_XLM_USD" ,

  // ALGO Enabled Exchanges
  "BINANCE_SPOT_ALGO_USDT",
  //"BINANCE_SPOT_ALGO_BUSD",
  //"BINANCE_SPOT_ALGO_USDC",
  "BINANCEUS_SPOT_ALGO_USDT",
  //"BINANCEUS_SPOT_ALGO_BUSD",
  //"BINANCEUS_SPOT_ALGO_USDC",
  "KUCOIN_SPOT_ALGO_USDT",
  "GATEIO_SPOT_ALGO_USDT",
  "HUOBIPRO_SPOT_ALGO_USD" ,
  "HUOBIPRO_SPOT_ALGO_USDT" ,
  "FTX_SPOT_ALGO_USD" ,
  "FTX_SPOT_ALGO_USDT" ,
  "KRAKEN_SPOT_ALGO_USD" ,
  "BITSTAMP_SPOT_ALGO_USD" ,
  "BITFINEX_SPOT_ALGO_USD" ,
  "BITFINEX_SPOT_ALGO_USDT" ,
  "POLONIEX_SPOT_ALGO_USDT" ,
  //"POLONIEX_SPOT_ALGO_USDC" ,
  "BITSO_SPOT_ALGO_USD" ,
  "CRYPTO_SPOT_ALGO_USDT" ,
  //"CRYPTO_SPOT_ALGO_USDC" ,
  "OKEX_SPOT_ALGO_USD",
  "OKEX_SPOT_ALGO_USDT",
  //"OKEX_SPOT_ALGO_USDC",
  "COINBASE_SPOT_ALGO_USD" ,

  // Doge Enabled Exchanges
  "BINANCE_SPOT_DOGE_USDT",
  //"BINANCE_SPOT_DOGE_BUSD",
  //"BINANCE_SPOT_DOGE_USDC",
  "BINANCEUS_SPOT_DOGE_USDT",
  //"BINANCEUS_SPOT_DOGE_BUSD",
  //"BINANCEUS_SPOT_DOGE_USDC",
  "KUCOIN_SPOT_DOGE_USDT",
  "GATEIO_SPOT_DOGE_USDT",
  "HUOBIPRO_SPOT_DOGE_USD" ,
  "HUOBIPRO_SPOT_DOGE_USDT" ,
  "FTX_SPOT_DOGE_USD" ,
  "FTX_SPOT_DOGE_USDT" ,
  "KRAKEN_SPOT_DOGE_USD" ,
  "BITSTAMP_SPOT_DOGE_USD" ,
  "BITFINEX_SPOT_DOGE_USD" ,
  "BITFINEX_SPOT_DOGE_USDT" ,
  "POLONIEX_SPOT_DOGE_USDT" ,
  //"POLONIEX_SPOT_DOGE_USDC" ,
  "BITSO_SPOT_DOGE_USD" ,
  "CRYPTO_SPOT_DOGE_USDT" ,
  //"CRYPTO_SPOT_DOGE_USDC" ,
  "OKEX_SPOT_DOGE_USD",
  "OKEX_SPOT_DOGE_USDT",
  //"OKEX_SPOT_DOGE_USDC",
  "COINBASE_SPOT_DOGE_USD" ,

  // ADA Enabled Exchanges
  "BINANCE_SPOT_ADA_USDT",
  //"BINANCE_SPOT_ADA_BUSD",
  //"BINANCE_SPOT_ADA_USDC",
  "BINANCEUS_SPOT_ADA_USDT",
  //"BINANCEUS_SPOT_ADA_BUSD",
  //"BINANCEUS_SPOT_ADA_USDC",
  "KUCOIN_SPOT_ADA_USDT",
  "GATEIO_SPOT_ADA_USDT",
  "HUOBIPRO_SPOT_ADA_USD" ,
  "HUOBIPRO_SPOT_ADA_USDT" ,
  "FTX_SPOT_ADA_USD" ,
  "FTX_SPOT_ADA_USDT" ,
  "KRAKEN_SPOT_ADA_USD" ,
  "BITSTAMP_SPOT_ADA_USD" ,
  "BITFINEX_SPOT_ADA_USD" ,
  "BITFINEX_SPOT_ADA_USDT" ,
  "POLONIEX_SPOT_ADA_USDT" ,
  //"POLONIEX_SPOT_ADA_USDC" ,
  "BITSO_SPOT_ADA_USD" ,
  "CRYPTO_SPOT_ADA_USDT" ,
  //"CRYPTO_SPOT_ADA_USDC" ,
  "OKEX_SPOT_ADA_USD",
  "OKEX_SPOT_ADA_USDT",
  //"OKEX_SPOT_ADA_USDC",
  "COINBASE_SPOT_ADA_USD" ,

  // BCH Enabled Exchanges
  "BINANCE_SPOT_BCH_USDT",
  //"BINANCE_SPOT_BCH_BUSD",
  //"BINANCE_SPOT_BCH_USDC",
  "BINANCEUS_SPOT_BCH_USDT",
  //"BINANCEUS_SPOT_BCH_BUSD",
  //"BINANCEUS_SPOT_BCH_USDC",
  "KUCOIN_SPOT_BCH_USDT",
  "GATEIO_SPOT_BCH_USDT",
  "HUOBIPRO_SPOT_BCH_USD" ,
  "HUOBIPRO_SPOT_BCH_USDT" ,
  "FTX_SPOT_BCH_USD" ,
  "FTX_SPOT_BCH_USDT" ,
  "KRAKEN_SPOT_BCH_USD" ,
  "BITSTAMP_SPOT_BCH_USD" ,
  "BITFINEX_SPOT_BCH_USD" ,
  "BITFINEX_SPOT_BCH_USDT" ,
  "POLONIEX_SPOT_BCH_USDT" ,
  //"POLONIEX_SPOT_BCH_USDC" ,
  "BITSO_SPOT_BCH_USD" ,
  "CRYPTO_SPOT_BCH_USDT" ,
  //"CRYPTO_SPOT_BCH_USDC" ,
  "OKEX_SPOT_BCH_USD",
  "OKEX_SPOT_BCH_USDT",
  //"OKEX_SPOT_BCH_USDC",
  "COINBASE_SPOT_BCH_USD" ,

  // DGB Enabled Exchanges
  "BINANCE_SPOT_DGB_USDT",
  //"BINANCE_SPOT_DGB_BUSD",
  //"BINANCE_SPOT_DGB_USDC",
  "BINANCEUS_SPOT_DGB_USDT",
  //"BINANCEUS_SPOT_DGB_BUSD",
  //"BINANCEUS_SPOT_DGB_USDC",
  "KUCOIN_SPOT_DGB_USDT",
  "GATEIO_SPOT_DGB_USDT",
  "HUOBIPRO_SPOT_DGB_USD" ,
  "HUOBIPRO_SPOT_DGB_USDT" ,
  "FTX_SPOT_DGB_USD" ,
  "FTX_SPOT_DGB_USDT" ,
  "KRAKEN_SPOT_DGB_USD" ,
  "BITSTAMP_SPOT_DGB_USD" ,
  "BITFINEX_SPOT_DGB_USD" ,
  "BITFINEX_SPOT_DGB_USDT" ,
  "POLONIEX_SPOT_DGB_USDT" ,
  //"POLONIEX_SPOT_DGB_USDC" ,
  "BITSO_SPOT_DGB_USD" ,
  "CRYPTO_SPOT_DGB_USDT" ,
  //"CRYPTO_SPOT_DGB_USDC" ,
  "OKEX_SPOT_DGB_USD",
  "OKEX_SPOT_DGB_USDT",
  //"OKEX_SPOT_DGB_USDC",
  "COINBASE_SPOT_DGB_USD" ,

  // BTC Enabled Exchanges
  "BINANCE_SPOT_BTC_USDT",
  //"BINANCE_SPOT_BTC_BUSD",
  //"BINANCE_SPOT_BTC_USDC",
  "BINANCEUS_SPOT_BTC_USDT",
  //"BINANCEUS_SPOT_BTC_BUSD",
  //"BINANCEUS_SPOT_BTC_USDC",
  "KUCOIN_SPOT_BTC_USDT",
  "GATEIO_SPOT_BTC_USDT",
  "HUOBIPRO_SPOT_BTC_USD" ,
  "HUOBIPRO_SPOT_BTC_USDT" ,
  "FTX_SPOT_BTC_USD" ,
  "FTX_SPOT_BTC_USDT" ,
  "KRAKEN_SPOT_BTC_USD" ,
  "BITSTAMP_SPOT_BTC_USD" ,
  "BITFINEX_SPOT_BTC_USD" ,
  "BITFINEX_SPOT_BTC_USDT" ,
  "POLONIEX_SPOT_BTC_USDT" ,
  //"POLONIEX_SPOT_BTC_USDC" ,
  "BITSO_SPOT_BTC_USD" ,
  "CRYPTO_SPOT_BTC_USDT" ,
  //"CRYPTO_SPOT_BTC_USDC" ,
  "OKEX_SPOT_BTC_USD",
  "OKEX_SPOT_BTC_USDT",
  //"OKEX_SPOT_BTC_USDC",
  "COINBASE_SPOT_BTC_USD" ,

  // ETH Enabled Exchange
  "BINANCE_SPOT_ETH_USDT",
  //"BINANCE_SPOT_ETH_BUSD",
  //"BINANCE_SPOT_ETH_USDC",
  "BINANCEUS_SPOT_ETH_USDT",
  //"BINANCEUS_SPOT_ETH_BUSD",
  //"BINANCEUS_SPOT_ETH_USDC",
  "KUCOIN_SPOT_ETH_USDT",
  "GATEIO_SPOT_ETH_USDT",
  "HUOBIPRO_SPOT_ETH_USD" ,
  "HUOBIPRO_SPOT_ETH_USDT" ,
  "FTX_SPOT_ETH_USD" ,
  "FTX_SPOT_ETH_USDT" ,
  "KRAKEN_SPOT_ETH_USD" ,
  "BITSTAMP_SPOT_ETH_USD" ,
  "BITFINEX_SPOT_ETH_USD" ,
  "BITFINEX_SPOT_ETH_USDT" ,
  "POLONIEX_SPOT_ETH_USDT" ,
  //"POLONIEX_SPOT_ETH_USDC" ,
  "BITSO_SPOT_ETH_USD" ,
  "CRYPTO_SPOT_ETH_USDT" ,
  //"CRYPTO_SPOT_ETH_USDC" ,
  "OKEX_SPOT_ETH_USD",
  "OKEX_SPOT_ETH_USDT",
  //"OKEX_SPOT_ETH_USDC",
  "COINBASE_SPOT_ETH_USD" ,

  // FIL Enabled Exchange
  "BINANCE_SPOT_FIL_USDT",
  //"BINANCE_SPOT_FIL_BUSD",
  //"BINANCE_SPOT_FIL_USDC",
  "BINANCEUS_SPOT_FIL_USDT",
  //"BINANCEUS_SPOT_FIL_BUSD",
  //"BINANCEUS_SPOT_FIL_USDC",
  "KUCOIN_SPOT_FIL_USDT",
  "GATEIO_SPOT_FIL_USDT",
  "HUOBIPRO_SPOT_FIL_USD" ,
  "HUOBIPRO_SPOT_FIL_USDT" ,
  "FTX_SPOT_FIL_USD" ,
  "FTX_SPOT_FIL_USDT" ,
  "KRAKEN_SPOT_FIL_USD" ,
  "BITSTAMP_SPOT_FIL_USD" ,
  "BITFINEX_SPOT_FIL_USD" ,
  "BITFINEX_SPOT_FIL_USDT" ,
  "POLONIEX_SPOT_FIL_USDT" ,
  //"POLONIEX_SPOT_FIL_USDC" ,
  "BITSO_SPOT_FIL_USD" ,
  "CRYPTO_SPOT_FIL_USDT" ,
  //"CRYPTO_SPOT_FIL_USDC" ,
  "OKEX_SPOT_FIL_USD",
  "OKEX_SPOT_FIL_USDT",
  //"OKEX_SPOT_FIL_USDC",
  "COINBASE_SPOT_FIL_USD" 
]


const xrpChannels = subscribe_channels.map((channel) => {if (channel.indexOf("XRP") > -1) return channel}).filter(entry => entry != undefined)
const ltcChannels = subscribe_channels.map((channel) => {if (channel.indexOf("LTC") > -1) return channel}).filter(entry => entry != undefined)
const adaChannels = subscribe_channels.map((channel) => {if (channel.indexOf("ADA") > -1) return channel}).filter(entry => entry != undefined)
const algoChannels = subscribe_channels.map((channel) => {if (channel.indexOf("ALGO") > -1) return channel}).filter(entry => entry != undefined)
const btcChannels = subscribe_channels.map((channel) => {if (channel.indexOf("BTC") > -1) return channel}).filter(entry => entry != undefined)
const ethChannels = subscribe_channels.map((channel) => {if (channel.indexOf("ETH") > -1) return channel}).filter(entry => entry != undefined)
const bchChannels = subscribe_channels.map((channel) => {if (channel.indexOf("BCH") > -1) return channel}).filter(entry => entry != undefined)
const dogeChannels = subscribe_channels.map((channel) => {if (channel.indexOf("DOGE") > -1) return channel}).filter(entry => entry != undefined)
const xlmChannels = subscribe_channels.map((channel) => {if (channel.indexOf("XLM") > -1) return channel}).filter(entry => entry != undefined)
const dgbChannels = subscribe_channels.map((channel) => {if (channel.indexOf("DGB") > -1) return channel}).filter(entry => entry != undefined)
const filChannels = subscribe_channels.map((channel) => {if (channel.indexOf("FIL") > -1) return channel}).filter(entry => entry != undefined)
  

function initWSArray() {
    let initArray = [[undefined], [undefined], [undefined], [undefined]]
    for (let i =0; i<24; i++) {
        initArray[0].push(undefined)
        initArray[1].push(undefined)
        initArray[2].push(undefined)        
        initArray[3].push(undefined)
    }
    return initArray
}



let sequence = 0;

function initArray () {
let array =[]
for (let i =0; i<dataTypes.length; i++) {
      array.push([undefined])
}
for (let i =0; i<array.length; i++) { 
  for (let j =0; j<exchanges.length-1; j++) {
      array[i].push(undefined)
  }
}
return array;   
}


function processWS(response) {

      const escapeRegExpMatch = function(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      };
      const isExactMatch = (str, match) => {
      return new RegExp(`\\b${escapeRegExpMatch(match)}\\b`).test(str)
      }
      
    subscribe_channels.map((channel)=> {
      if (isExactMatch(channel, response.symbol_id) == true) {
        if (channel.indexOf("XRP")> -1) setXRPArray(xrpChannels.indexOf(channel), response);
        if (channel.indexOf("LTC")> -1) setLTCArray(ltcChannels.indexOf(channel), response);
        if (channel.indexOf("BTC")> -1) setBTCArray(btcChannels.indexOf(channel), response);
        if (channel.indexOf("ETH")> -1) setETHArray(ethChannels.indexOf(channel), response);
        if (channel.indexOf("XLM")> -1) setXLMArray(xlmChannels.indexOf(channel), response);
        if (channel.indexOf("ADA")> -1) setADAArray(adaChannels.indexOf(channel), response);
        if (channel.indexOf("ALGO")> -1) setALGOArray(algoChannels.indexOf(channel), response);
        if (channel.indexOf("DGB")> -1) setDGBArray(dgbChannels.indexOf(channel), response);
        if (channel.indexOf("BCH")> -1) setBCHArray(bchChannels.indexOf(channel), response);
        if (channel.indexOf("FIL")> -1) setFILArray(filChannels.indexOf(channel), response);
        if (channel.indexOf("DOGE")> -1) setDOGEArray(dogeChannels.indexOf(channel), response);
        return
      }
    })

}
  
// ----------------- BINANCE ------------------------//

function binance(input, uuid) {
    // ----------------- Constants ------------------------//
    //const bin_channels = ["btcusdt","xrpusdt","adausdt","algousdt","xlmusdt","bchusdt","dogeusdt","ltcusdt","btcusdc","xrpusdc","adausdc","algousdc","xlmusdc","bchusdc","dogeusdc","ltcusdc","dgbusdt","dgbusdc","dgbbusd","filusdt","filusdc","filbusd","ethusdt","ethusdc","ethbusd"];
    let bin_channels = []
    for (let i = 1; i<input.length; i++) {
      bin_channels.push((input[i][2]+input[i][3]).toLowerCase());
    }

    var bin_endpointPath = '';
        for (let i=0; i < bin_channels.length; i++ ) {
          if (i===0) {
              bin_endpointPath += bin_channels[i]+"@trade";
          } else {
              bin_endpointPath += "/"+bin_channels[i]+"@trade";
          }
      };

    const bin_url = `wss://stream.binance.com:9443/stream?streams=${bin_endpointPath}`

    // ----------------- Websocket Initiation ------------------------//
     const bin_wss = new WebSocket(bin_url);
    // ----------------- Websocket Listeners ------------------------//
      bin_wss.on('open', function open() {
        //console.log("BINANCE WS:OPENED");
      });
    
      bin_wss.onmessage = function(evt:any) {
    
        try {
    
            const resp = JSON.parse(evt.data);

            if (resp == undefined) return;
            if (resp.data.p == undefined) return;

            const bin_resp_channels = bin_channels.map((pair) => pair.toUpperCase())

            /*
            "e": "trade",     // Event type
            "E": 123456789,   // Event time
            "s": "BNBBTC",    // Symbol
            "t": 12345,       // Trade ID
            "p": "0.001",     // Price
            "q": "100",       // Quantity
            "b": 88,          // Buyer order ID
            "a": 50,          // Seller order ID
            "T": 123456785,   // Trade time
            "m": true,        // Is the buyer the market maker?
            "M": true         // Ignore
            */
    
            bin_resp_channels.map (ticker => {
            if(resp.data.s.indexOf(ticker) > -1 ) {

               let asset = ticker.slice(0,-4)
               var base = ticker.replace(asset,'');
               if(resp.data.m == true) {var taker = "BUY"} else {var taker = "SELL"}

                processWS({
                    "type": input[0],
                    "symbol_id": `BINANCE_SPOT_${asset}_${base}`,
                    "sequence": ++sequence,
                    "time_exchange": resp.data.T,
                    "time_wakedapi": Date.now(),
                    "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                    "price": parseFloat(resp.data.p),
                    "size": parseFloat(resp.data.q),
                    "taker_side": taker
                  })
                }
          })
    
          } catch (error) {
            //console.log(error);
            //console.log("Binance error");
            return
          }
      };
      bin_wss.on('close', function close() {
          console.log("BINANCE WS:CLOSED AND RESUBSCRIBING");
    
          binance(input, uuid);
      });
      
    }

// ----------------- BINANCE US------------------------//
function binanceus(input, uuid) {
    // ----------------- Constants ------------------------//
    //const bin_us_channels = ["btcusdt","xrpusdt","adausdt","algousdt","xlmusdt","bchusdt","dogeusdt","ltcusdt","dogeusdt","dogeusdt","btcusdc","xrpusdc","adausdc","algousdc","xlmusdc","bchusdc","dogeusdc","ltcusdc","dogeusdc","dogeusdc","filusdt","filusdc","filbusd","ethusdt","ethusdc","ethbusd"];
    
    let bin_us_channels = []
    for (let i = 1; i<input.length; i++) {
      bin_us_channels.push((input[i][2]+input[i][3]).toLowerCase());
    }

    var bin_us_endpointPath = '';
    for (let i=0; i < bin_us_channels.length; i++ ) {
        if (i===0) {
            bin_us_endpointPath += bin_us_channels[i]+"@trade";
        } else {
            bin_us_endpointPath += "/"+bin_us_channels[i]+"@trade";
        }
    };
    const bin_us_url = `wss://stream.binance.us:9443/stream?streams=${bin_us_endpointPath}`
    // ----------------- Websocket Initiation ------------------------//
    const bin_us_wss = new WebSocket(bin_us_url);
    // ----------------- Websocket Listeners ------------------------//
        bin_us_wss.on('open', function open() {
          //console.log("BINANCEUS WS:OPENED");
      });  
      bin_us_wss.onmessage = function(evt) {
    
        try{
            const resp = JSON.parse(evt.data);
      
            if (resp == undefined) return;
            if (resp.data.p == undefined) return;

         const bin_us_resp_channels = bin_us_channels.map((pair) => pair.toUpperCase())

                /*
                "e": "trade",     // Event type
                "E": 123456789,   // Event time
                "s": "BNBBTC",    // Symbol
                "t": 12345,       // Trade ID
                "p": "0.001",     // Price
                "q": "100",       // Quantity
                "b": 88,          // Buyer order ID
                "a": 50,          // Seller order ID
                "T": 123456785,   // Trade time
                "m": true,        // Is the buyer the market maker?
                "M": true         // Ignore
                */
 
              bin_us_resp_channels.map( ticker => {
    
                if(resp.data.s.indexOf(ticker) > -1 ) {

                  if(ticker.indexOf("ALGO") > -1   || ticker.indexOf("DOGE") > -1  ) {
                      if (ticker.length< 8) {var asset = ticker.slice(0,-3)} 
                      else {var asset = ticker.slice(0,-4) }}

                  else if(ticker.length< 7) {var asset = ticker.slice(0,-3)}
                  else {var asset = ticker.slice(0,-4)}

                  var base = ticker.replace(asset,'');
                  if(resp.data.m == true) {var taker = "BUY"} else {var taker = "SELL"}
   
                   processWS({
                       "type": input[0],
                       "symbol_id": `BINANCEUS_SPOT_${asset}_${base}`,
                       "sequence": ++sequence,
                       "time_exchange": resp.data.T,
                       "time_wakedapi": Date.now(),
                       "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                       "price": parseFloat(resp.data.p),
                       "size": parseFloat(resp.data.q),
                       "taker_side": taker
                     })
                   }
            })
      
          } catch (error) {
              //console.log(error)
              //console.log("BinanceUS error");
              return
            }
    
      };
      bin_us_wss.on('close', function close() {
            console.log("BINANCEUS WS:CLOSED AND RESUBSCRIBING");
            binanceus(input, uuid);
      });
    }

// ----------------- BITSO ------------------------//
function bitso(input, uuid) {

      let bitso_channels = []
      for (let i = 1; i<input.length; i++) {
        bitso_channels.push((input[i][2]+"_"+input[i][3]).toLowerCase());
      }

      // ----------------- Constants ------------------------//
      const bitso_url = `wss://ws.bitso.com`
      // ----------------- Websocket Initiation ------------------------//
      const bitso_wss = new WebSocket(bitso_url);
      // ----------------- Websocket Functions ------------------------//
      function bitso_subscribe(targetBook) {
            //console.log(`Subscribing to BITSO ${targetBook}`)
            const message = JSON.stringify({ 
              action: 'subscribe', 
              book: targetBook, 
              type: 'trades' })
      
            return bitso_wss.send(message);
          };
      function bitso_unsubscribe (targetBook) {
            //console.log("unsubscribing from ticker WS")
      
            const message = JSON.stringify({ action: 'unsubscribe', book: targetBook, type: 'trades' })
    
            return bitso_wss.send(message);
          };
      // ----------------- Websocket Listeners ------------------------//
        bitso_wss.on('open', function open() {
              //console.log("WS: Websocket opened ");
      
            for (let i=0; i<bitso_channels.length; i++) {
                bitso_subscribe(bitso_channels[i]);
            }
        });
        bitso_wss.onmessage = function(evt) {
      
          try {
              const resp = JSON.parse(evt.data);
              if (resp == undefined) return;
              if (resp.action == "subscribe") return;
              if (resp.type == "ka") return;

              bitso_channels.map(ticker => {
                if(resp.book.indexOf(ticker) > -1 ) {
      
                let initTicker = ticker
      
                if (ticker.length == 7) {
                    initTicker = ticker+'a'
                }

                let asset = initTicker.slice(0,-5).toUpperCase();
                var base = ticker.replace(asset.toLowerCase()+"_",'').toUpperCase();
                if(resp.payload[0].t == 0) {var taker = "BUY"} else {var taker = "SELL"}
 
                 processWS({
                     "type": input[0],
                     "symbol_id": `BITSO_SPOT_${asset}_${base}`,
                     "sequence": ++sequence,
                     "time_exchange": undefined,
                     "time_wakedapi": Date.now(),
                     "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                     "price": parseFloat(resp.payload[0].r),
                     "size": parseFloat(resp.payload[0].a),
                     "taker_side": taker
                   })
              }
              })
    
            } catch (error) {
                //console.log(error)
                //console.log("Bitso error");
                return
              }
        };
        bitso_wss.on('close', function close() {
    
          for (let i=0; i<bitso_channels.length; i++) {
            bitso_unsubscribe(bitso_channels[i]);
        }
              console.log("BITSO WS: CLOSED AND RESUBSCRIBING");
              bitso(input, uuid);
        })
      }

// ----------------- BITSTAMP ------------------------//
function bitstamp(input, uuid) {
      // ----------------- Constants ------------------------//

            let bitstamp_channels = []
            for (let i = 1; i<input.length; i++) {
              bitstamp_channels.push((input[i][2]+input[i][3]).toLowerCase());
            }

          const stamp_url = 'wss://ws.bitstamp.net'
          const stamp_listenToCurrancies = bitstamp_channels.map(pair => {
                    return ("live_trades"+"_"+pair)
          })

          // ----------------- Websocket Initiation ------------------------//
          const stamp_wss = new WebSocket(stamp_url);
          // ----------------- Websocket Functions ------------------------//
            function stamp_subscribe(channel) {
              //console.log("BITSTAMP WS:SUBSCRIBE");
                const message = JSON.stringify({ 
                    "event": "bts:subscribe",
                    "data": {
                        "channel": channel
                    }})
          
                return stamp_wss.send(message);
              };
            function stamp_unsubscribe (channel) {
              //console.log("BITSTAMP WS:UNSUBSCRIBE");
                const message = JSON.stringify({ 
                    "event": "bts:unsubscribe",
                    "data": {
                        "channel": channel
                    }})
          
                return stamp_wss.send(message);
              };
          // ----------------- Websocket Listeners ------------------------//
            stamp_wss.on('open', function open() {
              //console.log("BITSTAMP WS:OPEN");
          
                for (let i = 0; i<stamp_listenToCurrancies.length; i++){
                    //console.log("WS: Subscribing to " + stamp_listenToCurrancies[i]);
                    stamp_subscribe(stamp_listenToCurrancies[i]);
                }
          
            });
            stamp_wss.on('message', function incoming(data) {
          
              try {
                const resp = JSON.parse(data);
          
                if (resp == undefined) return;
                if (resp.data.price == undefined) return;

                bitstamp_channels.map( ticker => {
                  if(resp.channel.indexOf(ticker) > -1 ) {
                    let initTicker = ticker
    
                    if (ticker.length = 6) {
                        initTicker = ticker+'a'
                    }
    
                    var asset = initTicker.slice(0,-4).toUpperCase();
                    var base = ticker.replace(asset.toLowerCase(),'').toUpperCase();

                           processWS({
                            "type": input[0],
                            "symbol_id": `BITSTAMP_SPOT_${asset}_${base}`,
                            "sequence": ++sequence,
                            "time_exchange": parseFloat(resp.data.microtimestamp),
                            "time_wakedapi": Date.now(),
                            "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                            "price": resp.data.price,
                            "size": resp.data.amount,
                            "taker_side": "BUY"
                          })
                        }
                      })
              } catch (error) {
                  //console.log(error)
                  //console.log("Bitstamp error");
                  return
                }
          
              });
            stamp_wss.on('close', function close() {
                console.log("BITSTAMP WS:CLOSE AND RESUBSCRIBING");
    
                for (let i = 0; i<stamp_listenToCurrancies.length; i++){
                  //console.log("WS: Unsubscribing to " + stamp_listenToCurrancies[i]);
                  stamp_unsubscribe(stamp_listenToCurrancies[i]);
              }
                bitstamp(stamp_pairs, minOrderSize, queue);
              })
        }

// ----------------- KRAKEN ------------------------//
function kraken(input, uuid) {
      // ----------------- Constants ------------------------//

      let kra_channel = []
      for (let i = 1; i<input.length; i++) {

        if (input[i][2] == "BTC") {input[i][2]="XBT"}
        if (input[i][2] == "DOGE") {input[i][2]="XDG"}

        kra_channel.push(input[i][2]+"/"+input[i][3]);
      }

    // ----------------- User defined channels ------------------------//
    const kra_url = 'wss://ws.kraken.com';
    // ----------------- Websocket Initiation ------------------------//
    const kra_wss = new WebSocket(kra_url);
    // ----------------- Websocket Functions ------------------------//
      function kra_subscribe() {
    
        //console.log("KRAKEN WS:SUBSCRIBED");
    
          const message = JSON.stringify({
            "event": "subscribe",
            "pair": kra_channel,
            "subscription": {
              "name": "trade"
            }
          })
    
          return kra_wss.send(message);
        };
      function kra_unsubscribe () {
    
        //console.log("KRAKEN WS:UNSUBSCRIBED");
    
        const message = JSON.stringify({
          "event": "unsubscribe",
          "pair": kra_channel,
          "subscription": {
            "name": "trade"
          }
        })
    
          return kra_wss.send(message);
        };
    // ----------------- Websocket Listeners ------------------------//
        kra_wss.on('open', function open() {
          //console.log("KRAKEN WS:OPENED");
              kra_subscribe();
      });
      kra_wss.onmessage = function(evt) {
    
        try {
        const resp = JSON.parse(evt.data);
  
        if( resp.event == "heartbeat") return;
        if( resp.event == "systemStatus") return;
        if( resp.event == "subscriptionStatus") return;
    
              kra_channel.map (ticker => {
    
                if(resp[3].indexOf(ticker) > -1 ) {
    
                  if(ticker.indexOf("XBT") > -1 ) {
                    var asset = "BTC"}
                   else if(ticker.indexOf("XDG") > -1 ) {
                    var asset = "DOGE"}
                  else if(ticker.indexOf("ALGO") > -1   || ticker.indexOf("DOGE") > -1  ) {
                    if (ticker.length< 9) {var asset = ticker.slice(0,-4)} 
                    else {var asset = ticker.slice(0,-5) }}

                      else if(ticker.length< 8) {var asset = ticker.slice(0,-4)}
                      else {var asset = ticker.slice(0,-5)}


                  if(ticker.indexOf("XBT") > -1 ) {
                        var base = ticker.replace("XBT/",'')}
                  else if(ticker.indexOf("XDG") > -1 ) {
                        var base = ticker.replace("XDG/",'')}
                  else {var base = ticker.replace(asset+"/",'')};

                  if (resp[1][0][3] == "b"){var taker = "BUY"} else {var taker = "SELL"}

                  let weightedInput = resp[1].map((resp) => {
                        return ({price :parseFloat(resp[0]), amount : parseFloat(resp[1])})
                  }) 

                  let sum = 0;
                  let price = weighted_average(weightedInput)
                     weightedInput.map ((resp) => {
                            sum += resp.amount
                  })
                  
                   processWS({
                    "type": input[0],
                    "symbol_id": `KRAKEN_SPOT_${asset}_${base}`,
                    "sequence": ++sequence,
                    "time_exchange": resp[1][0][2],
                    "time_wakedapi": Date.now(),
                    "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                    "price": price,
                    "size": sum,
                    "taker_side": taker
                  })

                }
              })
    
          } catch (error) {
            //console.log(error)
            //console.log("Kraken error");
            return
          }
    }
      kra_wss.on('close', function close() {
          console.log("KRAKEN WS:CLOSED AND RESUBSCRIBING");
          kra_unsubscribe();
          kraken(input, uuid);
        })
      }
    
// ------------ Coinbase -------------------//
function coinbase(input, uuid) {

        let cb_channels = []
        for (let i = 1; i<input.length; i++) {
          cb_channels.push(input[i][2]+"-"+input[i][3]);
        }
      const cb_url = 'wss://ws-feed.pro.coinbase.com';
    
      // ----------------- Websocket Initiation ------------------------//
      const cb_wss = new WebSocket(cb_url);
      // ----------------- Websocket Functions ------------------------//
        function cb_subscribe() {
          //console.log("COINBASE WS:SUBSCRIBING");
    
        const message = JSON.stringify(
                  {
                      "type": "subscribe",
                      "channels": [{ "name": "ticker", "product_ids": cb_channels }]
                  }
                )
    
            return cb_wss.send(message);
          };
        function cb_unsubscribe () {
    
          //console.log("COINBASE WS:UNSUBSCRIBING");
    
            const message = JSON.stringify(
              {
                "type": "unsubscribe",
                "channels": [{ "name": "ticker", "product_ids": cb_channels }]
            }
          )
            return cb_wss.send(message);
          };
      // ----------------- Websocket Listeners ------------------------//
        cb_wss.on('open', function open() {
            //console.log("COINBASE WS:OPENED");
            cb_subscribe();
        });
        cb_wss.on('message', function incoming(data) {
    
          try {
        
              const resp = JSON.parse(data);
              
              if (resp == undefined) return;
              if (resp.price == undefined) return;
        
              cb_channels.map( ticker => {
                  if(resp.product_id.indexOf(ticker) > -1 ) {


                    if(ticker.indexOf("ALGO") > -1   || ticker.indexOf("DOGE") > -1  ) {
                      if (ticker.length< 9) {var asset = ticker.slice(0,-4)} 
                      else {var asset = ticker.slice(0,-5) }}

                  else if(ticker.length< 8) {var asset = ticker.slice(0,-4)}
                  else {var asset = ticker.slice(0,-5)}

                  var base = ticker.replace(asset+"-",'');
                    

                     processWS({
                      "type": input[0],
                      "symbol_id": `COINBASE_SPOT_${asset}_${base}`,
                      "sequence": ++sequence,
                      "time_exchange": resp.time,
                      "time_wakedapi": Date.now(),
                      "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                      "price": parseFloat(resp.price),
                      "size": parseFloat(resp.last_size),
                      "taker_side": resp.side.toUpperCase()
                    })
                    }
              })
    
            } catch (error) {
                //console.log(error)
                //console.log("Coinbase error");
                return
              }
          });
    
        cb_wss.on('close', function close() {
            console.log("COINBASE WS:CLOSED AND RESUBSCRIBING");
            cb_unsubscribe ()
            coinbase(input, uuid);
          })
        }
       
// ------------ Kucoin -------------------//     
function kucoin(input, uuid) {
    
          const axios = require("axios")

          let ku_channels = []
          for (let i = 1; i<input.length; i++) {
            ku_channels.push(input[i][2]+"-"+input[i][3]);
      
          ku_auth_url = "https://api.kucoin.com/api/v1/bullet-public"
          
        async function init () {
              const resp = await axios.post ( ku_auth_url  ) ;
              //console.log("KUCOIN WS:INITIALIZING");
              return resp.data.data.token
          }
          
        async function ku_ws() {
          const authkey = await init();
          const connectId = 1545910660739
          
          const ku_url = `wss://ws-api.kucoin.com/endpoint?token=${authkey}&[connectId=${connectId}]`;
          
          // ----------------- Websocket Initiation ------------------------//
          const ku_wss = new WebSocket(ku_url);
          // ----------------- Websocket Functions ------------------------//
            function ku_subscribe() {
    
              //console.log("KUCOIN WS:SUBSCRIBED");
                const message = JSON.stringify(
                  { 
                      "id": 1545910660739,                          //The id should be an unique value
                      "type": "subscribe",
                      "topic": `/market/ticker:${ku_channels}`,  //Topic needs to be subscribed. Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
                      "privateChannel": false,                      //Adopted the private channel or not. Set as false by default.
                      "response": true                              //Whether the server needs to return the receipt information of this subscription or not. Set as false by default.
                  }
                )
                return ku_wss.send(message);
              };
            function ku_unsubscribe () {
                //console.log("KUCOIN WS:UNSUBSCRIBED");
                const message = JSON.stringify(
                    { 
                          "id": 1545910660739,                          //The id should be an unique value
                          "type": "unsubscribe",
                          "topic": `/market/ticker:${ku_channels}`,  //Topic needs to be subscribed. Some topics support to divisional subscribe the informations of multiple trading pairs through ",".
                          "privateChannel": false,                      //Adopted the private channel or not. Set as false by default.
                          "response": true   
                      }                           //Whether the server needs to return the receipt information of this subscription or not. Set as false by default.
                    )
          
                return ku_wss.send(message);
              };
          // ----------------- Websocket Listeners ------------------------//
              ku_wss.on('open', function open() {
                  //console.log("KUCOIN WS:OPEN");
                  ku_subscribe() 
            });
          
            ku_wss.onmessage = function(evt) {
              
              try {
                  const resp = JSON.parse(evt.data);

                  if (resp.type == "ack") return;
                  if (resp == undefined) return;
                  if (resp.data.price == undefined) return;
            
                  ku_channels.map(ticker => {
                      if(resp.topic.indexOf(ticker) > -1 ) {
          
                              if(ticker.indexOf("ALGO") > -1  || ticker.indexOf("DOGE") > -1 ) {
                                if (ticker.length< 9) {var asset = ticker.slice(0,-4)} 
                                else {var asset = ticker.slice(0,-5) }}
          
                            else if(ticker.length< 8) {var asset = ticker.slice(0,-4)}
                            else {var asset = ticker.slice(0,-5)}


          
                            var base = ticker.replace(asset+"-",'');
             
                             processWS({
                                 "type": input[0],
                                 "symbol_id": `KUCOIN_SPOT_${asset}_${base}`,
                                 "sequence": ++sequence,
                                 "time_exchange": resp.data.time,
                                 "time_wakedapi": Date.now(),
                                 "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                                 "price": parseFloat(resp.data.price),
                                 "size": parseFloat(resp.data.size),
                                 //"taker_side": taker
                               })
                             
                        }
                  })
          
                } catch (error) {
                    //console.log("Kucoin error");
                    return
                  }
          }
            ku_wss.on('close', function close() {
                //console.log("KUCOIN WS:CLOSED AND RESUBSCRIBING");
                ku_unsubscribe ()
                ku_ws(input, uuid);
              })
          
          
          }
          
          ku_ws(input, uuid);
    
        }
      }
    
// ------------ FTX -------------------//
function ftx(input, uuid) {
          // ----------------- User defined channels ------------------------//
          let ftx_channels = []
          for (let i = 1; i<input.length; i++) {
            ftx_channels.push((input[i][2]+"/"+input[i][3]))
          }
      
          const ftx_url = 'wss://ftx.com/ws/';
          // List of all ftx markets - https://ftx.com/api/markets 
    
          // ----------------- Websocket Initiation ------------------------//
          const ftx_wss = new WebSocket(ftx_url);
          // ----------------- Websocket Functions ------------------------//
            function ftx_subscribe(channel) {
    
              //console.log(`FTX WS:SUBSCRIBING ${channel}`);

                const message = JSON.stringify(
                  {'op': 'subscribe', 
                  'channel': 'trades', 
                  'market': channel
              })
          
                return ftx_wss.send(message);
              };
            function ftx_unsubscribe (channel) {
    
              //console.log("FTX WS:UNSUBSCRIBING");
          
                const message = JSON.stringify(
                  {'type': 'unsubscribed', 'channel': 'trades', 'market': channel})
          
                return ftx_wss.send(message);
              };
          // ----------------- Websocket Listeners ------------------------//
              ftx_wss.on('open', function open() {
                //console.log("FTX WS:OPEN");
                    
                for (let i=0; i<ftx_channels.length; i++) {
                  ftx_subscribe(ftx_channels[i]);
                }
            });
            
            ftx_wss.onmessage = function(evt) {
              try {
          
              const resp = JSON.parse(evt.data);
          
              if( resp.type == "subscribed") return;
    
                    ftx_channels.map (ticker => {
                        if(resp.market.indexOf(ticker) > -1 ) {
                            let initTicker = ticker

                            if (ticker.length == 7) {
                                initTicker = ticker+'a'
                            }

                            let asset = initTicker.slice(0,-5)

                            if (ticker.indexOf('DOGE') > -1) {
                                  asset = 'DOGE'
                              }
      
                        var base = ticker.replace(asset+"/",'');

                        let weightedInput = resp.data.map((resp) => {
                          return ({price :parseFloat(resp.price), amount : parseFloat(resp.size)})
                        }) 
  
                        let sum = 0;
                        let price = weighted_average(weightedInput)
                          weightedInput.map ((resp) => {
                                  sum += resp.amount
                        })
                        
                       processWS({
                        "type": input[0],
                        "symbol_id": `FTX_SPOT_${asset}_${base}`,
                        "sequence": ++sequence,
                        "time_exchange": resp.data[0].time,
                        "time_wakedapi": Date.now(),
                        "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                        "price": price,
                        "size": sum,
                        "taker_side": resp.data[0].side.toUpperCase()
                      })
                    }
                  })
                } catch (error) {
                  //console.log(error)
                  //console.log("FTX error");
                  return
                }
          }
            ftx_wss.on('close', function close() {
                console.log("FTX WS:CLOSED AND RESUBSCRIBING");
          
                for (let i=0; i<ftx_channels.length; i++) {
                  ftx_unsubscribe(ftx_channels[i]);
                }
                ftx(input, uuid)
              })
          }
          
// ------------ HUOBI -------------------//
function huobi(input, uuid) {

            let huobi_channels = []
            for (let i = 1; i<input.length; i++) {
              huobi_channels.push((input[i][2]+input[i][3]).toLowerCase());
            }

          const huo_url = `wss://api.huobi.pro/ws`
    
          // ----------------- Websocket Initiation ------------------------//
          const huo_wss = new WebSocket(huo_url);
          
          function huo_subscribe() {
            //console.log("HUOBI WS:SUBSCRIBING");
          
                  //var symbols = ['btcusdt', 'xrpusdt', 'ltcusdt', 'dogeusdt', 'dgbusdt', 'algousdt', 'adausdt', 'xlmusdt', 'filusdt', 'dgbusdt', 'ethusdt'];
          
                  for (let symbol of huobi_channels) {
                      huo_wss.send(JSON.stringify({
                          "sub": `market.${symbol}.trade.detail`,
                          "id": `${symbol}`
                      }));
                  }
                };
          
          function huo_unsubscribe () {
    
            //console.log("HUOBI WS:UNSUBSCRIBING");
          
              for (let symbol of huobi_channels) {
                  huo_wss.send(JSON.stringify({
                      "unsub": `market.${symbol}.trade.detail`,
                      "id": `${symbol}`
                  }));
              }
            };
          
          // ----------------- Websocket Listeners ------------------------//
              huo_wss.on('open', function open() {
                  //console.log("HUOBI WS:OPENED");
                  huo_subscribe();
            });  
          
            huo_wss.onmessage = function(evt:Inflate) {

                  let text = pako.inflate(evt.data, {
                      to: 'string'
                  });

                  let msg = JSON.parse(text);
          
                  if (msg.ping) {
                      huo_wss.send(JSON.stringify({
                          pong: msg.ping
                      }));
                  } else {
          
              try{
                  let symbol = msg.ch.split('.')[1];

                  msg.tick.data.map((resp:Object) => {

                    var asset = symbol.slice(0,-4).toUpperCase();
                    var base = symbol.replace(asset.toLowerCase(),'').toUpperCase();

                           processWS({
                            "type": input[0],
                            "symbol_id": `HUOBIPRO_SPOT_${asset}_${base}`,
                            "sequence": ++sequence,
                            "time_exchange": resp.ts,
                            "time_wakedapi": Date.now(),
                            "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                            "price": parseFloat(resp.price),
                            "size": parseFloat(resp.amount),
                            "taker_side": resp.direction.toUpperCase()
                          })
                  })
                } catch (error) {
                    //console.log(error)
                    //console.log("HUOBI error");
                    return
                  }
              }
            };
          
            huo_wss.on('close', async function close() {
                      console.log("HUOBI WS:CLOSED AND RESUBSCRIBING");
                      await huo_unsubscribe();
                      huobi(input, uuid);
            });
          }
    
// ------------ CRYPTO -------------------//
function crypto(input, uuid) {

            let crypto_channels = []
            for (let i = 1; i<input.length; i++) {
                  crypto_channels.push((input[i][2]+"_"+input[i][3]))
            }
    
            // ----------------- User defined channels ------------------------//
            //const crypto_url = 'wss://stream.crypto.com/v2/user';
            const crypto_url = 'wss://stream.crypto.com/v2/market';
            
              const handledChannel = crypto_channels.map(ticker => {return `trade.${ticker}`} )
            
            // ----------------- Websocket Initiation ------------------------//
            const crypto_wss = new WebSocket(crypto_url);
            // ----------------- Websocket Functions ------------------------//
              function crypto_subscribe() {
    
                //console.log("CRYPTO WS:SUBSCRIBING");
                  const message = JSON.stringify(
                    {
                        "id": 11,
                        "method": "subscribe",
                        "params": {
                          "channels": handledChannel
                        },
                        "nonce": 1587523073344
                      }
                )
            
                  return crypto_wss.send(message);
                };
              function crypto_unsubscribe () {
            
                  const message = JSON.stringify(
            
                    {
                        "id": 11,
                        "method": "unsubscribe",
                        "params": {
                          "channels": handledChannel
                        },
                        "nonce": 1587523073344
                      })
            
                  return crypto_wss.send(message);
                };
            // ----------------- Websocket Listeners ------------------------//
                crypto_wss.on('open', function open() {
                  //console.log("CRYPTO WS:OPEN");
                    crypto_subscribe();
              });
              crypto_wss.onmessage = function(evt) {

                try {
                const resp = JSON.parse(evt.data);
            
                    if (resp.method == 'public/heartbeat') {
                        //console.log("Received heartbeat, sending response")
                        const message = JSON.stringify(
                                {
                                    "id": resp.id,
                                    "method": "public/respond-heartbeat"
                                })
                        crypto_wss.send(message);
                    } else {
    
                      for ( let i =0 ; i< resp.result.data.length; i++ ) {

                      var asset = resp.result.data[0].i.slice(0, -5)
                      var base = resp.result.instrument_name.replace(asset+"_",'')

                             processWS({
                              "type": input[0],
                              "symbol_id": `CRYPTO_SPOT_${asset}_${base}`,
                              "sequence": ++sequence,
                              "time_exchange": resp.result.data[i].t,
                              "time_wakedapi": Date.now(),
                              "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                              "price": resp.result.data[i].p,
                              "size": resp.result.data[i].q,
                              "taker_side": resp.result.data[i].s
                            })
                    }
                  }
            
                } catch (error) {
                  //console.log(error)
                  //console.log("CRYPTO error");
                }
            }
            
              crypto_wss.on('close', async function close() {
                    console.log("CRYPTO WS:CLOSED AND RESUBSCRIBING");
            
                    await crypto_unsubscribe();
            
                  crypto(input, uuid)
                })
            }
            
// ------------ GATE -------------------//
function gate(input, uuid) {

              let gate_channels = []
              for (let i = 1; i<input.length; i++) {
                    gate_channels.push((input[i][2]+"_"+input[i][3]))
              }

              const gate_url = `wss://ws.gate.io/v4`
              const client_id = 1234
              
              // ----------------- Websocket Initiation ------------------------//
              const gate_wss = new WebSocket(gate_url);
              
              function gate_subscribe() {
                  //console.log("GATEIO WS:SUBSCRIBING");
                    var msg = {
                        id: client_id,
                        method: 'trades.subscribe',
                        params: gate_channels
                    };
                    gate_wss.send(JSON.stringify(msg));
                };
              
              function gate_unsubscribe () {
                //console.log("GATEIO WS:UNSUBSCRIBING");
                      var msg = {
                          id: client_id,
                          method: 'trades.unsubscribe',
                          params: gate_channels
                      };
                      gate_wss.send(JSON.stringify(msg));
                };
              
              // ----------------- Websocket Listeners ------------------------//
                  gate_wss.on('open', function open() {
                      //console.log("GATEIO WS:OPENED");
                      gate_subscribe();
              
                });  
              
                gate_wss.onmessage = function(evt) {
              
                  const resp = JSON.parse(evt.data);

                  try{
                    resp.params[1].map( data => {
                      var asset = resp.params[0].slice(0, -5)
                      var base = resp.params[0].replace(asset+"_",'')

                             processWS({
                              "type": input[0],
                              "symbol_id": `GATEIO_SPOT_${asset}_${base}`,
                              "sequence": ++sequence,
                              "time_exchange": data.time,
                              "time_wakedapi": Date.now(),
                              "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                              "price": parseFloat(data.price),
                              "size": parseFloat(data.amount),
                              "taker_side": data.type.toUpperCase()
                            })
                      })
    
                    } catch (error) {
                        //console.log("GATEIO error");
                        return
                      }
                };
              
                gate_wss.on('close', async function close() {
                          console.log("GATEIO WS:CLOSED AND RESUBSCRIBING");
                          await gate_unsubscribe();
                          gate(input, uuid);
                });
              
              }

// ------------ OKEX -------------------//    
function okex(input, uuid) {

                  let okex_channels = []
                  for (let i = 1; i<input.length; i++) {
                        okex_channels.push((input[i][2]+"-"+input[i][3]))
                  }

                  const ok_url = `wss://real.okex.com:8443/ws/v3`
            
                  // ----------------- Websocket Initiation ------------------------//
                  const ok_wss = new WebSocket(ok_url);
                  
                  function ok_subscribe() {
                    //console.log("OK WS:SUBSCRIBING");
                  
                          for (let symbol of okex_channels) {
                              ok_wss.send(JSON.stringify({
                                "op": "subscribe", 
                                "args": [`spot/ticker:${symbol}`]
                              }));
                          }
                        };
                  
                  function ok_unsubscribe () {
            
                    //console.log("OK WS:UNSUBSCRIBING");
                  
                      for (let symbol of okex_channels) {
                          ok_wss.send(JSON.stringify({
                            "op": "unsubscribe", 
                            "args": [`spot/ticker:${symbol}`]
                          }));
                      }
                    };
                  
                  // ----------------- Websocket Listeners ------------------------//
                      ok_wss.on('open', function open() {
                        //console.log("OK WS:OPENED");
                          ok_subscribe();
                  
                    });  
                  
                    ok_wss.onmessage = function(evt) {
                      
                          let text = pako.inflate(evt.data, {
                              to: 'string',
                              raw: true 
                          });
                          let msg = JSON.parse(text);

                          if( msg.event == "subscribe") return //console.log(`OKEX Subscribing to ${msg.channel}`);
                  
                      try{

                        for ( let i =0 ; i<msg.data.length; i++) {
                          let quantity = msg.data[i].last_qty 
                          if (msg.data[i].last_qty == 0 ) quantity=0.000001
                  
                          var asset = msg.data[i].instrument_id.slice(0,-5);
                          var base = msg.data[i].instrument_id.replace(asset+"-",'');
      
                                 processWS({
                                  "type": input[0],
                                  "symbol_id": `OKEX_SPOT_${asset}_${base}`,
                                  "sequence": ++sequence,
                                  "time_exchange": msg.data[i].timestamp,
                                  "time_wakedapi": Date.now(),
                                  "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                                  "price": parseFloat(msg.data[i].last),
                                  "size": parseFloat(quantity),
                                  "taker_side": "BUY"
                                })
                              }
                          
                        } catch (error) {
                            //console.log(error)
                            //console.log("OK error");
                            return
                          }
                      
                    };
                  
                    ok_wss.on('close', async function close() {
                              console.log("OK WS:CLOSED AND RESUBSCRIBING");
                              await ok_unsubscribe();
                              okex(input, uuid);
                    });
                  }

// ------------ BITFINEX -------------------//   
function bitfinex(input, uuid) {

                    let bitfinex_channels = []
                    for (let i = 1; i<input.length; i++) {
                           bitfinex_channels.push((input[i][2]+input[i][3]))
                    }

                    const bitfinex_url = `wss://api.bitfinex.com/ws/1`
              
                    // ----------------- Websocket Initiation ------------------------//
                    const bitfinex_wss = new WebSocket(bitfinex_url);
                    
                    function bitfinex_subscribe() {
                      //console.log("BITFINEX WS:SUBSCRIBING");
                    
                            for (let symbol of bitfinex_channels) {
                              bitfinex_wss.send(JSON.stringify({
                                "event": "subscribe",
                                "channel": "trades",
                                "pair": symbol
                                }));
                            }
                          };
                    
                    function bitfinex_unsubscribe () {
              
                      //console.log("BITFINEX WS:UNSUBSCRIBING");
                    
                        for (let symbol of bitfinex_channels) {
                          bitfinex_wss.send(JSON.stringify({
                                "event": "subscribe",
                                "channel": "trades",
                                "pair": symbol
                            }));
                        }
                      };
                    
                    // ----------------- Websocket Listeners ------------------------//
                    bitfinex_wss.on('open', function open() {
                          //console.log("BITFINEX WS:OPENED");
                          bitfinex_subscribe();
                    
                      });  
                    
                      bitfinex_wss.onmessage = function(evt) {
                        
                            let msg = JSON.parse(evt.data)

                            if( msg.event == "subscribed") return //console.log(`BITFINEX Subscribing to ${msg.pair}`);
                            if( msg[1] == "hb") return;
                            
                        try{

                          /*if (msg[1].length >1) {
                             for (let i =0; i<msg[1].length; i++) {
                                  var pair = msg[1][i][0].slice(11);
                                  var asset = pair.slice(0, -3);
                                  var base = pair.replace(asset,'');
                                  if (msg[1][i][msg[1][i].length-1] > 0) {var taker = "BUY"} else {var taker = "SELL"}
              
                                        console.log({
                                          "type": input[0],
                                          "symbol_id": `BITFINEX_SPOT_${asset}_${base}`,
                                          "sequence": ++sequence,
                                          "time_exchange": msg[1][i][msg[1][i].length-3],
                                          "time_wakedapi": Date.now(),
                                          "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                                          "price": parseFloat(msg[1][i][msg[1][i].length-2]),
                                          "size": Math.abs(msg[1][i][msg[1][i].length-1]),
                                          "taker_side": taker
                                        })
                                }
                              }*/

                              if (msg[1] == "te") {

                              var pair = msg[2].slice(11);
                              var asset = pair.slice(0, -3);
                              var base = pair.replace(asset,'');
                              if (msg[msg.length-1] > 0) {var taker = "BUY"} else {var taker = "SELL"}
          
                                     processWS({
                                      "type": input[0],
                                      "symbol_id": `BITFINEX_SPOT_${asset}_${base}`,
                                      "sequence": ++sequence,
                                      "time_exchange": msg[msg.length-3],
                                      "time_wakedapi": Date.now(),
                                      "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                                      "price": parseFloat(msg[msg.length-2]),
                                      "size": Math.abs(msg[msg.length-1]),
                                      "taker_side": taker
                                    })
                                }
                          } catch (error) {
                                //console.log(error)
                                //console.log("BITFINEX error")
                    }
                  }
                    
                      bitfinex_wss.on('close', async function close() {
                                console.log("BITFINEX WS:CLOSED AND RESUBSCRIBING");
                                await bitfinex_unsubscribe();
                                bitfinex(input, uuid);
                      });
                    }

async function poloniex(input, uuid) {

                    const axios = require("axios")

                    let poloniex_channels = []
                    for (let i = 1; i<input.length; i++) {
                      poloniex_channels.push(input[i][3]+"_"+input[i][2])
                    }

                    const poloniex_url = `wss://api2.poloniex.com`

                    const poloniex_api = "https://poloniex.com/public?command=returnTicker"
                    const poloniex_id = await axios.get ( poloniex_api ) ;
                    const idArray = Object.entries(poloniex_id.data);

                    const tickerKey =  poloniex_channels.map((ticker) => {
                            let index = idArray.find((entry) => entry[0] == ticker)
                            if (index == undefined ) {var returnData = [ticker, null]} else {var returnData = [ticker, index[1].id]} 
                            return returnData
                    })
                                
                    // ----------------- Websocket Initiation ------------------------//
                    const poloniex_wss = new WebSocket(poloniex_url);
                    
                    function poloniex_subscribe() {
                      //console.log("POLONIEX WS:SUBSCRIBING");
                    
                              poloniex_wss.send(JSON.stringify({
                                "command": "subscribe", 
                                "channel": 1002
                                }));
                            };
                    
                    function poloniex_unsubscribe () {

                      //console.log("POLONIEX WS:UNSUBSCRIBING");
                    
                          poloniex_wss.send(JSON.stringify({
                            "command": "unsubscribe", 
                            "channel": 1002
                            }));
                        };
                    
                    // ----------------- Websocket Listeners ------------------------//
                    poloniex_wss.on('open', function open() {
                          //console.log("POLONIEX WS:OPENED");
                          poloniex_subscribe();
                    
                      });  
                    
                      poloniex_wss.onmessage = function(evt) {
                        
                            let msg = JSON.parse(evt.data);

                           if(msg[1] == 1 ) return //console.log("Subscribing")
                    
                        try{

                          for ( let i =0; i<tickerKey.length; i++) {

                            if(msg[2][0] == tickerKey[i][1]) {

                                var base = tickerKey[i][0].slice(0,-4);
                                var asset = tickerKey[i][0].replace(asset+"_",'');
            
                                       processWS({
                                        "type": input[0],
                                        "symbol_id": `POLONIEX_SPOT_${asset}_${base}`,
                                        "sequence": ++sequence,
                                        "time_exchange": undefined,
                                        "time_wakedapi": Date.now(),
                                        "uuid": "770C7A3B-7258-4441-8182-83740F3E2457",
                                        "price": parseFloat(msg[2][1]),
                                        "size": undefined,
                                        "taker_side": "BUY"
                                      })
                                    }
                            }
                        } catch (error) {
                            //console.log(error)
                            //console.log("POLONIEX error");
                            return
                          }
                      
                      };
                    
                      poloniex_wss.on('close', async function close() {
                                console.log("POLONIEX WS:CLOSED AND RESUBSCRIBING");
                                await poloniex_unsubscribe();
                                poloniex(input, uuid);
                      });
  }

function setXRPArray(rowNumber, response) {
      xrp[0][rowNumber] = response.price;
      if (xrp[1][rowNumber] == undefined) {
        xrp[1][rowNumber] = response.size}
      else {
        xrp[1][rowNumber] += response.size}
}

function setLTCArray(rowNumber, response) {
      ltc[0][rowNumber] = response.price;
      if (ltc[1][rowNumber] == undefined) {
        ltc[1][rowNumber] = response.size}
      else {
        ltc[1][rowNumber] += response.size}
}

function setXLMArray(rowNumber, response) {
      xlm[0][rowNumber] = response.price;
      if (xlm[1][rowNumber] == undefined) {
        xlm[1][rowNumber] = response.size}
      else {
        xlm[1][rowNumber] += response.size}
}

function setALGOArray(rowNumber, response) {
      algo[0][rowNumber] = response.price;
      if (algo[1][rowNumber] == undefined) {
        algo[1][rowNumber] = response.size}
      else {
        algo[1][rowNumber] += response.size}
}

function setDOGEArray(rowNumber, response) {
      doge[0][rowNumber] = response.price;
      if (doge[1][rowNumber] == undefined) {
        doge[1][rowNumber] = response.size}
      else {
        doge[1][rowNumber] += response.size}
}

function setADAArray(rowNumber, response) {
      ada[0][rowNumber] = response.price;
      if (ada[1][rowNumber] == undefined) {
        ada[1][rowNumber] = response.size}
      else {
        ada[1][rowNumber] += response.size}
}

function setBCHArray(rowNumber, response) {
      bch[0][rowNumber] = response.price;
      if (bch[1][rowNumber] == undefined) {
        bch[1][rowNumber] = response.size}
      else {
        bch[1][rowNumber] += response.size}
}

function setDGBArray(rowNumber, response) {
      dgb[0][rowNumber] = response.price;
      if (dgb[1][rowNumber] == undefined) {
        dgb[1][rowNumber] = response.size}
      else {
        dgb[1][rowNumber] += response.size}
}

function setBTCArray(rowNumber, response) {
      btc[0][rowNumber] = response.price;
      if (btc[1][rowNumber] == undefined) {
        btc[1][rowNumber] = response.size}
      else {
        btc[1][rowNumber] += response.size}
}

function setETHArray(rowNumber, response) {
      eth[0][rowNumber] = response.price;
      if (eth[1][rowNumber] == undefined) {
        eth[1][rowNumber] = response.size}
      else {
        eth[1][rowNumber] += response.size}
}

function setFILArray(rowNumber, response) {
      fil[0][rowNumber] = response.price;
      if (fil[1][rowNumber] == undefined) {
        fil[1][rowNumber] = response.size}
      else {
        fil[1][rowNumber] += response.size}
}

function getWeightedAverage(data:Array, binanceWeight:number) {
    let priceWeightSum = 0;
    let weightSum = 0;
    let priceWeightSumAvg = 0;
    let priceWeightSumAvgMean = 0;
    let weightSumAvg = 0;

    data[2][0] = binanceWeight;
    let remainingWeight = 100 - binanceWeight;
    let zeroPriceElements = 0;

    for (let i = 1; i < data[0].length; i++) {
        if (data[0][i] != undefined ) zeroPriceElements++;
    }

    for (let i = 0; i < data[0].length; i++) {

        if (i != 0 && data[0][i] != undefined) {
          data[2][i] = (remainingWeight / zeroPriceElements);
        }

        //PURE MEAN AVERAGE PRICE
        if (data[0][i] != undefined) {
          priceWeightSumAvgMean += data[0][i];
        }

        //FIXED MEAN AVERAGE PRICE
        if (data[0][i] != undefined) {
          priceWeightSumAvg += (data[0][i] * data[2][i]);
          weightSumAvg += data[2][i];
        }

        //VOL WEIGHT AVERAGE PRICE
        if (data[0][i] != undefined && data[1][i] != undefined) {
            priceWeightSum += (data[0][i] * data[1][i]);
            weightSum += data[1][i];
          }
        }

        var mean = priceWeightSumAvgMean / (zeroPriceElements+1)
        var deviationSum = 0

        //Standard Deviation Calculation
        for (let i = 0; i < data[0].length; i++) {
          if (data[0][i] != undefined && data[1][i] != undefined) {
                data[3][i] = (data[0][i] - mean);
          }
          if (data[3][i] != undefined) {
                deviationSum += data[3][i] ** 2
            }
          }
        
        var standardDeviation = Math.sqrt(deviationSum/(zeroPriceElements+1));
        var priceDeviationCount = 0;
        var priceDeviationSum = 0;

        //Standard Deviation Mean
        for (let i = 0; i < data[0].length; i++) {
          if (data[0][i] != undefined && Math.abs(data[3][i]) < standardDeviation) {
                priceDeviationSum += data[0][i]
                priceDeviationCount++;
            }
          }

          //Price Reordering and then 50% median
          let priceSort = data[0].filter((index) => index != undefined).sort(function(a, b) {
                return a - b;
          });

          //Middle Median Mean Average Price
          if (priceSort.length<4) { var medianArray = priceSort }
            else {var medianArray = priceSort.slice(Math.floor(priceSort.length/4),-Math.floor(priceSort.length/4))}
          var medianSum = 0
          for (let i = 0; i < medianArray.length; i++) {
                  medianSum += medianArray[i]
              }

    return ([
            priceWeightSum / weightSum, //WVAP Weighted Volumn Average Price
            priceWeightSumAvg / weightSumAvg, //FMAP Fixed Mean Average Price
            priceWeightSumAvgMean / (zeroPriceElements+1), //PMAP Pure Mean Average Price
            priceDeviationSum / priceDeviationCount, //SDAP Pure Mean Average Price
            medianSum / medianArray.length, //Middle Median Mean Average Price
            data[1][0]*100/weightSum, ////Weight Determined Binance Weight
            binanceWeight, //Fixed Binance Weight
            standardDeviation, //Standard Deviation
            data[3] //Standard Deviation Meta
          ]) //* 100000;
}

wsInput(
  {
  "type": "hello",
  "apikey": "73034021-THIS-IS-SAMPLE-KEY",
  "heartbeat": false,
  "subscribe_data_type": ["trade"],
  "subscribe_filter_symbol_id": subscribe_channels
})


var xrpTimeSeries = Date.now()
var xlmTimeSeries = Date.now()
var dogeTimeSeries = Date.now()
var adaTimeSeries = Date.now()
var algoTimeSeries = Date.now()
var bchTimeSeries = Date.now()
var dgbTimeSeries = Date.now()
var btcTimeSeries = Date.now()
var ethTimeSeries = Date.now()
var ltcTimeSeries = Date.now()
var filTimeSeries = Date.now()

//Sets routes for RESTAPI. Refer to README.md for API endpoints

const getPrice = async (req:Request, res:Response, next:NextFunction) => {
  try {

    var value = undefined;
    var meta =  undefined;
    var timeDelta = undefined;

  switch (req.params.token) {
    case "XRPUSD":
        value = getWeightedAverage(xrp, 18);
        meta = {prices:xrp[0],volumes:xrp[1], deviation:value[8]};
        timeDelta = Date.now() - xrpTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
            xrpTimeSeries = Date.now();
            xrp = initWSArray();}
        break;
    case "LTCUSD":
        value = getWeightedAverage(ltc,15);
        meta = {prices:ltc[0],volumes:ltc[1], deviation:value[8]};
        timeDelta = Date.now() - ltcTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
           ltc = initWSArray();
           ltcTimeSeries = Date.now();}
        break;
    case "BTCUSD":
        value = getWeightedAverage(btc,10);
        meta = {prices:btc[0],volumes:btc[1], deviation:value[8]};
        timeDelta = Date.now() - btcTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
          btc = initWSArray();
          btcTimeSeries = Date.now();}
        break;
    case "ALGOUSD":
        value = getWeightedAverage(algo,40);
        meta = {prices:algo[0],volumes:algo[1], deviation:value[8]};
        timeDelta = Date.now() - algoTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
          algo = initWSArray();
          algoTimeSeries = Date.now();}
        break;
    case "ETHUSD":
        value = getWeightedAverage(eth,30);
        meta = {prices:eth[0],volumes:eth[1], deviation:value[8]};
        timeDelta = Date.now() - ethTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
           eth = initWSArray();
           ethTimeSeries = Date.now();}
        break;
    case "ADAUSD":
        value = getWeightedAverage(ada,10);
        meta = {prices:ada[0],volumes:ada[1], deviation:value[8]};
        timeDelta = Date.now() - adaTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
          ada = initWSArray();
          adaTimeSeries = Date.now();}
        break;
    case "BCHUSD":
        value = getWeightedAverage(bch,18);
        meta = {prices:bch[0],volumes:bch[1], deviation:value[8]};
        timeDelta = Date.now() - bchTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
          bch = initWSArray();
          bchTimeSeries = Date.now();}
        break;
    case "DGBUSD":
        value = getWeightedAverage(dgb,50);
        meta = {prices:dgb[0],volumes:dgb[1], deviation:value[8]};
        timeDelta = Date.now() - dgbTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
          dgb = initWSArray();
          dgbTimeSeries = Date.now();}
        break;
    case "FILUSD":
        value = getWeightedAverage(fil,24);
        meta = {prices:fil[0],volumes:fil[1], deviation:value[8]};
        timeDelta = Date.now() - filTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
           fil = initWSArray();
           filTimeSeries = Date.now();}
        break;
    case "XLMUSD":
        value = getWeightedAverage(xlm,27);
        meta = {prices:xlm[0],volumes:xlm[1], deviation:value[8]};
        timeDelta = Date.now() - xlmTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
           xlm = initWSArray();
           xlmTimeSeries = Date.now();}
        break;
    case "DOGEUSD":
        value = getWeightedAverage(doge,8);
        meta = {prices:doge[0],volumes:doge[1], deviation:value[8]};
        timeDelta = Date.now() - dogeTimeSeries;
        if (req.params.reset == "true" || timeDelta/1000 > 200 ) {
          doge = initWSArray();
          dogeTimeSeries = Date.now();}
        break;
    }

    if (value == undefined) {
      const err = new Error('Price or token not found');
      err.status = 404;
      throw err;
    }

    res.json({
      "price":(value[1]+value[2]+value[3]+value[4])/4,// For API ping 
      "priceWVAP":value[0],
      "priceFixedMean":value[1],
      "pricePureMean":value[2], 
      "priceDeviationMean":value[3], 
      "priceMiddleMean":value[4], 
      "priceGrossMean":(value[0]+value[1]+value[2]+value[3]+value[4])/5, 
      "binanceVolWeight":value[5], 
      "binanceFixedWeight":value[6],
      "StandardDeviation":value[7],
      "timeSeries": timeDelta/1000,
      "meta": meta
    });
  
  
  } catch (e) {
    next(e);
  }
};

const controller = {
    getPrice
}

export default controller