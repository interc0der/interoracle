import txParser  from '../index';
import { Client } from 'xrpl';
import { once } from 'events';

import { Method } from '../../../../types/oracle'

// Instantiate client for xrpljs. Use websockets url for full features
// If skipped, default client will be executed. 
const client_url: string = "wss://xrplcluster.com"
const api = new Client(client_url) 
  
// Standard request per xrpljs. See official documentation at 
const request:any = {
  command: 'subscribe',
  streams: [
    //'transactions_proposed', 
    'transactions', 
    //'ledger', 
    //'validations', 
    //'consensus'
    //'server'
    ]
}

// Parsing method for package. See...
const method:Method = {
  client: api, // Optional. See config file for default client and server
  filter: "offers_fill_all", // Optional. Default null
  log: false // Optional. Default false
}

let count:number = 0 //Include count if you would like to track the number of responses

async function main(request, method) {

  // If request included a stream, use a while loop to catch all new responses... 
  if( request.command == 'subscribe') {
      await api.connect()
      while(true) {
            try{    
                await txParser(request, method)
                count++; 
                const [ parsedTx ] = await once(api, 'TransactionParsed');
                console.log(`Parse Count: ${count}`)
                console.log(parsedTx)
                //console.log(api)
                if ( parsedTx instanceof Error ) throw new Error(parsedTx.message)
            } catch (error) {
                console.log(error)
                return await api.disconnect();
            }
        }
    } 
    
  // If not, just preform the request and capture the response.
    await api.connect()
    const parsedTx = await txParser(request, method)
    console.log(parsedTx)
    return await api.disconnect();
}

main(request, method)

// ------------------------------------------------//



