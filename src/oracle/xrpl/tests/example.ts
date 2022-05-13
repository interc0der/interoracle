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
  filter: "all_checks", // Optional. Default null
  log: false // Optional. Default false
}

let count:number = 0 //Include count if you would like to track the number of responses

async function main() {
  // If request included a stream, use a while loop to catch all new responses... 
    if( request.command == 'subscribe') {
      while(true) {
            try{
                count++; 
                const [ parsedTx ] = await once(api, 'TransactionParsed');
                console.log(`Parse Count: ${count}`)
                console.log(parsedTx)
                if ( parsedTx instanceof Error ) throw new Error(parsedTx.message)
            } catch (error) {
                console.log(error)
                return await api.disconnect();
            }
        }
    }
    
  // If not, just preform the request and capture the response.
    const parsedTx = await txParser({ request, method })
    console.log(parsedTx)
    return await api.disconnect();
}

main()

// ------------------------------------------------//



