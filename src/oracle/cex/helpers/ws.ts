import process from './process';
import handleOpen from './handleOpen';
import handleIncomingMsg from './handleMsg';
import WebSocket from 'ws';
import db from '../../../api/helpers/db'

class Interoracle {
    [index:string]:any
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

    pairs:string[]
    str_pairs:string[]
    type:string
    sequence:number
    channels:string[]
    ws:any
    exchange:string
    indices:number[]
    tickers:string[][]

    peer:any

    constructor(peer, exchange:string, global:string[], pairs:string[]) {
        this.pairs = pairs
        this.str_pairs=[]
        this.type = pairs[0]
        this.channels = []
        this.ws = undefined
        this.exchange = exchange
        this.sequence = 0
        this.indices = []
        this.tickers=[]
        this.peer = peer

        this._processURL(exchange,global,pairs)
    }

    private _processURL = async ( exchange:string, global: string[], pairs:string[]) => {
        [this.str_pairs, this.indices] = await process.getPairIndices(global, pairs)
        let [channels, url] = await process.instantiate(exchange, pairs)
        if (exchange == 'POLONIEX') this.tickers = await process.getTickers(channels)
        this.channels = channels
        if (url == undefined) return console.log(`Error finding ${exchange} url`)
        this._connect(url)
    }

    private _connect = (url: string):void => {
        this.ws = new WebSocket(url); 
        this.ws.onopen = (evt:any) => this._onOpen(evt);
        this.ws.onmessage = (evt:any) => this._onMessage(evt);
        this.ws.onerror= (evt:any) => this._onError(evt);
        this.ws.onclose= (evt:any) => this._onClose(evt);
    }

    //indicates that the connection is ready to send and receive data
    private async _onOpen(event: any): Promise<void> {
        console.log(this.exchange, "connected");
        let response = await handleOpen(this.exchange, this.ws, this.channels)
        if (response != undefined) console.log(response)
    }

    //An event listener to be called when a message is received from the server
    private async _onMessage(event: any): Promise<void> {
        //console.log(JSON.parse(event.data))
        let response = await handleIncomingMsg(
                                        this.ws,
                                        this.exchange, 
                                        event, 
                                        this.channels, 
                                        this.tickers,
                                        this.type, 
                                        this.sequence,
                                        this.peer.id,
                                        this.pairs
                                        )
        this.sequence++

        if (response != undefined && response.price != undefined) {
            let message = JSON.stringify(response);
            this.peer.socket.send(message, error => '');

            let index = this.str_pairs.indexOf(response.symbol_id)
            let global_index = this.indices[index]
            let asset = response.symbol_id.split('_')[2]
            let base = response.symbol_id.split('_')[3]

            if (global_index != undefined){
                this[asset][0][global_index]=response.price
            }
            
            if (global_index != undefined && response.size){
                let prev_size = this[asset][1][global_index]
                if (!prev_size) prev_size=0
                this[asset][1][global_index]=response.size+prev_size
            }      
        }
    }

    //An event listener to be called when an error occurs. This is a simple event named "error".
    private _onError(event: any): void {
        console.log(this.exchange, 'error');
    }

    //An event listener to be called when the WebSocket connection's readyState changes to CLOSED.
    private _onClose(event: any): void {
        console.log(JSON.stringify(event.data));
    }
}
 
export { Interoracle }