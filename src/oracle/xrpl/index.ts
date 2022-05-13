import client from './helpers/client';

import { Method } from 'types/oracle'

const index = async (request:any, method?: Method | undefined) => {

    if (!method || !method.client) {
        let api = client._init(method) 
        await client._connect(api) 
        await client._request(api, request) 
        let response = await client._addlistener(api, "transaction", client._parsetx) 
        return response
    }

    if ( method.client.isConnected() ) {

        let api = method.client;
        client._setMethod(method);
        await client._request(api, request) 
        api.removeAllListeners('transaction')
        let response = await client._addlistener(api, "transaction", client._parsetx) 
        return response
        
    } else  {
        return 'Client is not connected. Hint: Ensure than your script begins with client.connect()'
    }

}


export default index