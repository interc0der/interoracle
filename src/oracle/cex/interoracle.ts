import WebSocket from 'ws';
import db from '../../api/helpers/db'
import constants from './helpers/constants'

import utils from './helpers/utils';

import init from './helpers/init';
import open from './helpers/open';
import msg from './helpers/msg';

import { Request } from 'types/request'
import { Peer } from 'types/peer'

/**
 * 
 * Interoracle
 * Websocket template for listening for live exchange trades
 * 
 */
class Interoracle {
    [index:string]:any

    pairs:string[]
    str_pairs:string[]
    type:string
    sequence:number
    channels:string[]|any
    ws:any
    exchange:string
    indices:number[]
    tickers:string[][]
    url:string|any

    peer:Peer

    constructor(peer:Peer, exchange:string, global:string[], pairs:string[]) {
        this.pairs = pairs
        this.str_pairs=[]
        this.type = pairs[0]
        this.channels = []
        this.ws = undefined
        this.exchange = exchange
        this.sequence = 0
        this.indices = []
        this.tickers=[]
        this.url=''
        this.peer = peer

        this._processURL(global,pairs)
    }

    private _processURL = async (global: string[], pairs:string[]) => {
        
        [ this.str_pairs, this.indices ] = await utils.getPairIndices(global, pairs);

        [ this.channels, this.url ] = await init[this.exchange](pairs);

        if (this.exchange == 'POLONIEX' ) this.tickers = await utils.getTickers(this.channels)
        if (!this.url) return console.log(`Error finding ${this.exchange} url`)

        this._connect(this.url)
    }

    private _connect = (url: string):void => {
        this.ws = new WebSocket(url); 
        this.ws.onopen = (evt:any) => this._onOpen(evt);
        this.ws.onmessage = (evt:any) => this._onMessage(evt);
        this.ws.onerror= (evt:any) => this._onError(evt);
        this.ws.onclose= (evt:any) => this._onClose(evt);
    }

    public disconnect = ():void => {
        this.ws.close();
        setTimeout(() => {this._forceClose()}, 10000);
    }

    private _forceClose = ():void => {
        if ([this.ws.OPEN, this.ws.CLOSING].includes(this.ws.readyState)) {
                this.ws.terminate();
        }
    }

    //indicates that the connection is ready to send and receive data
    private async _onOpen(event: any): Promise<void> {
        console.log(this.exchange, "connected");
        let response = open[this.exchange](this.ws, this.channels)
        if (response != undefined) console.log(response)
    }

    //An event listener to be called when a message is received from the server
    private async _onMessage(event: any): Promise<void> {
        //console.log(JSON.parse(event.data))
        let response = msg[this.exchange](
                                this.ws,event, 
                                this.channels, 
                                this.pairs, 
                                this.type, 
                                this.sequence,
                                this.peer.id,
                                this.tickers )
        
        // Catch an empty response or empty price
        // TODO: Add message handling for non trade messages
        if (response == undefined || response.price == undefined) return

        // Add to exchange sequence number
        this.sequence++

        // Send message to peer
        let message = JSON.stringify(response);
        this.peer.socket.send(message, error => '');

        // Find local ticker index and global ticker index
        let index = this.str_pairs.indexOf(response.symbol_id)
        let global_index = this.indices[index]
        let asset = response.symbol_id.split('_')[2]
        let base = response.symbol_id.split('_')[3]

        // Record trade PRICE to the prototype data matrix
        if (global_index != undefined){
            this[asset][0][global_index]=response.price
        }
        
        // Record trade VOLUME to the prototype data matrix
        if (global_index != undefined && response.size){
            let prev_size = this[asset][1][global_index]
            if (!prev_size) prev_size=0
            this[asset][1][global_index]=response.size+prev_size
        }      
    }

    //An event listener to be called when an error occurs. This is a simple event named "error".
    private _onError(event: any): void {
        console.log(this.exchange, 'error');
        this.peer.socket.send(JSON.stringify({
            exchange:this.exchange, 
            type: 'Websocket error',
            msg: event}), error => '');
    }

    //An event listener to be called when the WebSocket connection's readyState changes to CLOSED.
    private _onClose(event: any): void {
        console.log(`Closing ${this.exchange} for ${this.peer.id}`);
        this.peer.socket.send(JSON.stringify({
            exchange:this.exchange, 
            type: 'Websocket close',
            msg: event}), error => '');
    }
}


/**
 * 
 * initialize
 * Initialize all exchange sockets according to the peer's request
 * 
 * @param { Peer } peer 
 * @param { Request } request 
 * @returns { Array } Array of exchange sockets 
 */
export const initialize = (peer:Peer, request:Request) => {
    //Subscribe to websockets TRADES
    try{
        let exchangeArray: void | ( any | string[])[][] = utils.organizeByExchange(request)
        let currencyObj: void | object = utils.organizeByCurrency(request)

        let channels: string[] = request.subscribe_filter_symbol_id;

        // If something goes wrong with the util functions, throw error
        if (!exchangeArray || !currencyObj || !channels ) throw Error

        // Get array of ASSETS in request, used for API 
        let currencyArray:string[] = Object.keys(currencyObj)

        // Create websocket class for each exchange, and store in socket array
        // Socket array passed back to parent class so that the socket can be terminated if necessary
        let sockets:any=[]
        for (let i =0; i<exchangeArray.length; i++) {
            if (exchangeArray[i].length>1 ) {
                let exchange = exchangeArray[i][1][0];
                let ws = new Interoracle(peer, exchange, channels, exchangeArray[i]);
                sockets.push(ws);
            }
        }

        // Create a data matrix prototype for each ASSET
        // Since prototype, each exchange socket can talk to each ASSET data matrix
        // Three blank matrices, 1: Price, 2: Volume, 3: Placeholder
        for (let i =0; i<currencyArray.length; i++) {
            Interoracle.prototype[currencyArray[i]] = utils.createEmptyArray(
                                                                currencyObj[currencyArray[i]].length, 
                                                                3, 
                                                                undefined)
        }

        return sockets
    }catch(error) {
        console.log(error)
    }
}  

export default Interoracle 