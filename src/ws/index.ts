import express from 'express';
import http from 'http';
const app = express();

import { init } from '../oracle/cex/index'

const port = 4050
const uuidv4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

const server = http.createServer(app);
server.listen(port, '0.0.0.0');
console.log('Server is running on port', port);

class InteroracleWS {
    wss: any;
    constructor() {
        const WebSocket = require('ws');
        this.wss = new WebSocket.Server({ port : 4051});
        this.wss.on('connection', (socket) => this._onConnection(new Peer(socket)));
        console.log('The websocket is running and listening for requests');
    }

    _onConnection = (peer) => {
        peer.socket.on('message', message => this._onMessage(peer, message));
        this._keepAlive(peer);

        // send displayName
        this._send(peer, {
            type: 'success',
            msg: 'The connection to the server websocket was successful',
            id: peer.id
        });
    }

    _onMessage = async (sender, message) => {
        // Try to parse message 
        try {
            message = JSON.parse(message);
        } catch (e) {
            return; // TODO: handle malformed JSON
        }


        let api;
        switch (message.type) {
          case 'pong':
              sender.lastBeat = Date.now();
              break;
          case 'init':
                sender.lastBeat = Date.now();
/*                 api = await init()
                await api.connect();
                let proposed = await listenToProposed(api,message.account)
                this._send(sender,{type:'proposed'})
                let result = await listenForPayment(api, message.account) */
                this._send(sender,{type:'validated'})
                await api.disconnect();
              break;
          case 'subscribe':
                sender.lastBeat = Date.now();
                init(sender, message, message.subscribe_filter_symbol_id)
/*                api = await init()
                await api.connect();
                let mint = await ledger.nftMint([api,message.uri,message.flags])
                this._send(sender,{type:'minted', hash: mint[0], tokenID: mint[1]})
                let transfer = await ledger.nftTransfer([api,message.account,mint[1]])
                this._send(sender,{type:'transfer', id: transfer}) */
                //await api.disconnect();
              break;    
      }
    }

    _send = (peer, message) => {
        if (!peer) return;
        if (this.wss.readyState !== this.wss.OPEN) return;
        message = JSON.stringify(message);
        peer.socket.send(message, error => '');
    }

    _keepAlive = (peer) => {
        this._cancelKeepAlive(peer);
        var timeout = 30000;
        if (!peer.lastBeat) {
            peer.lastBeat = Date.now();
        }
        if (Date.now() - peer.lastBeat > 2 * timeout) {
            peer.socket.terminate();
            return;
        }

        this._send(peer, { type: 'ping' });

        peer.timerId = setTimeout(() => this._keepAlive(peer), timeout);
    }

    _cancelKeepAlive = (peer) => {
        if (peer && peer.timerId) {
            clearTimeout(peer.timerId);
        }
    }
}

class Peer {
    socket: any;
    id: string;
    timerId: number;
    lastBeat: number;
    constructor(socket) {
        // set socket
        this.socket = socket;
        this.id = this._uuid();
        // for keepalive
        this.timerId = 0;
        this.lastBeat = Date.now();
    }

    _uuid() {
        let uuid = '',
            ii;
        for (ii = 0; ii < 32; ii += 1) {
            switch (ii) {
                case 8:
                case 20:
                    uuid += '-';
                    uuid += (Math.random() * 16 | 0).toString(16);
                    break;
                case 12:
                    uuid += '-';
                    uuid += '4';
                    break;
                case 16:
                    uuid += '-';
                    uuid += (Math.random() * 4 | 8).toString(16);
                    break;
                default:
                    uuid += (Math.random() * 16 | 0).toString(16);
            }
        }
        return uuid;
    };
}

new InteroracleWS()

