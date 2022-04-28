import process from './process';
import handleOpen from './handleOpen';
import handleIncomingMsg from './handleMsg';
import WebSocket from 'ws';

class Interoracle {

    XRP:any 
    LTC:any 
    ADA:any 
    ALGO:any 
    BTC:any 
    ETH:any 
    BCH:any 
    DOGE:any 
    XLM:any 
    DGB:any 
    FIL:any 

    pairs: string[]
    str_pairs: string[]
    type: string
    sequence: number
    channels: string[]
    ws: any
    exchange: string
    indices: number[]
    tickers: string[][]

    constructor(exchange:string, global:string[], pairs:string[]) {
        this.pairs = pairs
        this.str_pairs=[]
        this.type = pairs[0]
        this.channels = []
        this.ws = undefined
        this.exchange = exchange
        this.sequence = 0
        this.indices = []
        this.tickers=[]

        this._processURL(exchange,global,pairs)
    }

    _processURL = async ( exchange:string, global: string[], pairs:string[]) => {
        [this.str_pairs, this.indices] = await process.getPairIndices(global, pairs)
        let [channels, url] = await process.instantiate(exchange, pairs)
        if (exchange == 'POLONIEX') this.tickers = await process.getTickers(channels)
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
        let response = await handleIncomingMsg(
                                        this.ws,
                                        this.exchange, 
                                        event, 
                                        this.channels, 
                                        this.tickers,
                                        this.type, 
                                        this.sequence
                                        )
        this.sequence++

        if (response != undefined && response.price != undefined) {
            let index = this.str_pairs.indexOf(response.symbol_id)
            let global_index = this.indices[index]
            if (global_index != undefined){
                if (response.symbol_id.includes('XRP')) this.XRP[0][global_index]=response.price
                if (response.symbol_id.includes('BTC')) this.BTC[0][global_index]=response.price
                if (response.symbol_id.includes('ETH')) this.ETH[0][global_index]=response.price
                if (response.symbol_id.includes('XLM')) this.XLM[0][global_index]=response.price
            }
        }
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

Interoracle.prototype.XRP = process.createEmptyArray(30, 1, undefined)
Interoracle.prototype.LTC = process.createEmptyArray(30, 1, undefined)
Interoracle.prototype.ADA = process.createEmptyArray(30, 1, undefined);
Interoracle.prototype.ALGO = process.createEmptyArray(30, 1, undefined);
Interoracle.prototype.BTC = process.createEmptyArray(30, 1, undefined);
Interoracle.prototype.ETH = process.createEmptyArray(30, 1, undefined);
Interoracle.prototype.BCH = process.createEmptyArray(30, 1, undefined);
Interoracle.prototype.DOGE = process.createEmptyArray(30, 1, undefined);
Interoracle.prototype.XLM = process.createEmptyArray(30, 1, undefined);
Interoracle.prototype.DGB = process.createEmptyArray(30, 1, undefined);
Interoracle.prototype.FIL = process.createEmptyArray(30, 1, undefined);

export default Interoracle 
