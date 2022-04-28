import process from './process';
import handleOpen from './handleOpen';
import handleIncomingMsg from './handleMsg';
import WebSocket from 'ws';

class Interoracle {
    XRP:any = process.createEmptyArray(24, 4, undefined)
    LTC:any = process.createEmptyArray(24, 4, undefined)
    ADA:any = process.createEmptyArray(24, 4, undefined);
    ALGO:any = process.createEmptyArray(24, 4, undefined);
    BTC:any = process.createEmptyArray(24, 4, undefined);
    ETH:any = process.createEmptyArray(24, 4, undefined);
    BCH:any = process.createEmptyArray(24, 4, undefined);
    DOGE:any = process.createEmptyArray(24, 4, undefined);
    XLM:any = process.createEmptyArray(24, 4, undefined);
    DGB:any = process.createEmptyArray(24, 4, undefined);
    FIL:any = process.createEmptyArray(24, 4, undefined);
    pairs: string[]
    type: string
    sequence: number
    channels: string[]
    ws: any
    exchange: string
    constructor(exchange:string, pairs:string[]) {
        this.pairs = pairs
        this.type = pairs[0]
        this.channels = []
        this.ws = undefined
        this.exchange = exchange
        this.sequence = 0
        this._processURL(exchange,pairs)
    }

    _processURL = async ( exchange:string, pairs:string[]) => {
        let [channels, url] = await process.instantiate(exchange, pairs)
        this.channels = channels
        if (url == undefined) return console.log(`Error finding ${exchange} url`)
        this._connect(url)
    }

    _connect = (url: string):void => {
        this.ws = new WebSocket(url); 
        this.ws.onopen = (evt:any) => this._onOpen(evt);
        this.ws.onmessage = (evt:any) => this._onMessage(evt);
        this.ws.onerror= (evt:any) => this._onError(evt);
        this.ws.onclose= (evt:any) => this._onClose(evt);
    }

    //indicates that the connection is ready to send and receive data
    async _onOpen(event: any): Promise<void> {
        console.log("connected");
        let response = await handleOpen(this.exchange, this.ws, this.channels)
        if (response != undefined) console.log(response)
    }

    //An event listener to be called when a message is received from the server
    async _onMessage(event: any): Promise<void> {
        let response = await handleIncomingMsg(this.exchange, event, this.channels, this.type, this.sequence)
        this.sequence++
        if (response != undefined) console.log(response)
    }

    //An event listener to be called when an error occurs. This is a simple event named "error".
    _onError(event: any): void {
        console.log(JSON.stringify(event.data));
    }

    //An event listener to be called when the WebSocket connection's readyState changes to CLOSED.
    _onClose(event: any): void {
        console.log(JSON.stringify(event.data));
    }
}


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
  

let request = {
    "type": "hello",
    "apikey": "THIS-IS-SAMPLE-KEY",
    "heartbeat": false,
    "subscribe_data_type": ["trade"],
    "subscribe_filter_symbol_id": subscribe_channels
}

let array:any = process.organizeByExchange(request)
let response = process.initializeWS(array)


setTimeout(() => {
    console.log(Interoracle.prototype.XRP)
}, 10000)


/* Interoracle.prototype.XRP = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.LTC = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.ADA = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.ALGO = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.BTC = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.ETH = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.BCH = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.DOGE = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.XLM = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.DGB = process.createEmptyArray(24, 4, undefined);
Interoracle.prototype.FIL = process.createEmptyArray(24, 4, undefined); */

export { Interoracle }
