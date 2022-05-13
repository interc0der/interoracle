import { txParser } from '../handler';
import { Client } from 'xrpl';
import { modTransactionStream } from '../models/parser';
import { TransactionStream } from '../models'
import { default_server } from '../config'

const url = default_server

var method;
var count = 0;

    const _init = (handler?) => {
        method = handler
        return new Client(url)
    }

    const _setMethod = (handler?) => {
        method = handler
        return
    }

    const _connect = (api:Client) => {
        return new Promise((resolve, reject) => {
        api.connect()
        api.on("connected", () => {
            return resolve("Connected")
           })
        })
    }

    const _disconnect = (api:Client) => {
        return new Promise((resolve, reject) => {
            api.disconnect()
            api.on("disconnected", () => {
                return resolve("Disconnected")
            })
        })
    }

    const _parsetx = (tx:any) => {
        return txParser(tx, method);
    }

    const _request = (api:Client, request:any) => {
        return api.request(request)
    }

    const _addlistener = (api:Client, listener:string | symbol, fn:Function) => {
        return new Promise((resolve, reject) => {
            api.addListener(listener, (response) => {
                return resolve(fn(response))
            })
        })
    }

export default { 
    _init,
    _setMethod,
    _connect,
    _disconnect,
    _parsetx,
    _request,
    _addlistener
}

