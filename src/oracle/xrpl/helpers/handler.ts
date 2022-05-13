import { filters } from "../config";

/* import { allExchanges } from '../scripts/all/allExchanges';
import { allAffectedAccounts } from '../scripts/all/allAffectedAccounts'; */
import { allOffers } from '../scripts/all/allOffers';
/* import { allMemos } from '../scripts/all/allMemos';
import { allPaymentChannels } from '../scripts/all/allPayChans';
import { allPayments } from '../scripts/all/allPayments';
import { allBalanceChanges } from '../scripts/all/allBalanceChanges';
import { allEscrows } from '../scripts/all/allEscrows';
import { allChecks } from '../scripts/all/allChecks'; */


import { txParserInterface } from "../models/parser";


import { Method } from 'types/oracle'

import types from '../scripts/transactions';

const txHandler = (tx : txParserInterface, method: Method | undefined ) => {

        if (method && method.filter 
            && filters.indexOf(method.filter) === -1 ) return Error("The defined parse filter is not avaliable.");

        if ( tx.type == "response" ) return tx.result
        if ( tx.type == "transaction" ) return tx
        if ( tx.type == "TransactionEntryResponse") return tx.result

        return Error("This is not in an eligible tranaction format");
}


export const txParser = async (tx:any, method?: Method | undefined) => {

    var response:any;


    try {
        const handledTx:any = txHandler(tx, method)

        if (!method) return  

        if (handledTx instanceof Error) {
            if (method.client) method.client.emit("TransactionParsed", new Error(handledTx.message) )
            return new Error(handledTx.message)}
        else { 
            if (method.log == true ) console.log( `WRLD: Parsing Tx for ${method.filter}... tx_hash:`, handledTx.transaction.hash ) 
        }

         /* if (method.filter == "all_exchanges") response = allExchanges(handledTx) */

        if (method.filter == "all_offers") response = allOffers(handledTx) 

/*         if (method.filter == "all_payments_channels") response = allPaymentChannels(handledTx) 
        if (method.filter == "all_payments") response = allPayments(handledTx) 
        if (method.filter == "all_memos") response = allMemos(handledTx) 
        if (method.filter == "all_escrows") response = allEscrows(handledTx) 
        if (method.filter == "all_checks") response = allChecks(handledTx) 
        if (method.filter == "all_balance_changes") response = allBalanceChanges(handledTx)
        if (method.filter == "all_accounts_affected") response = allAffectedAccounts(handledTx)  */


        if (method.filter == "offers_fill_partial") response = types.OfferPartialFills(handledTx)
        if (method.filter == "offers_fill_full") response = types.OfferFilled(handledTx)
        if (method.filter == "offers_fill_all") response = types.OfferAllFills(handledTx)

/*         if (method.filter == "offers_cancel" 
            || method.filter == "OfferCancel") response = types.OfferCancels(handledTx)
        if (method.filter == "offers_create" 
            || method.filter == "OfferCreate") response = types.OfferCreates(handledTx) 

        if (method.filter == "PaymentChannelCreate") response = types.PaymentChannelCreate(handledTx) 
        if (method.filter == "PaymentChannelClaim") response = types.PaymentChannelClaim(handledTx)
        if (method.filter == "PaymentChannelFund") response = types.PaymentChannelFund(handledTx)


        if (method.filter == "TrustSet") response = types.TrustSet(handledTx)
        if (method.filter == "TicketCreate") response = types.TicketCreate(handledTx)

        if (method.filter == "SetRegularKey") response = types.SetRegularKey(handledTx)
        if (method.filter == "AccountSet") response = types.AccountSet(handledTx)
        if (method.filter == "AccountDelete") response = types.AccountDelete(handledTx)

        if (method.filter == "Payment") response = types.Payment(handledTx) */
        
        if (method.client && response ) method.client.emit("TransactionParsed", response )

        return response  

    } catch (error) {
        return error;
    }
}

export { txHandler }
