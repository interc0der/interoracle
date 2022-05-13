import { allExchanges } from './allExchanges';
import { allAffectedAccounts } from './allAffectedAccounts';
import { allOffers } from './allOffers';
import { allMemos } from './allMemos';
import { allPaymentChannels } from './allPayChans';
import { allPayments } from './allPayments';
import { allBalanceChanges } from './allBalanceChanges';
import { allEscrows } from './allEscrows';
import { allChecks } from './allChecks';
import { txParserInterface } from "./models/parser";
import { txHandler } from './handler';
import client from './helpers/client';

import { Method } from 'types/oracle'

const index = async (request , method?: Method | undefined) => {

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
        let response = await client._addlistener(api, "transaction", client._parsetx) 
        return response
        
    } else  {
        return 'Client is not connected. Hint: Ensure than your script begins with client.connect()'
    }

}


export { index }