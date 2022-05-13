import { dropsToXrp } from 'xrpl';
import { TransactionStream } from './../../models/methods/subscribe';
import { parseBalanceChanges } from './lib';
import { BigNumber } from 'bignumber.js';

import { PaymentInterface } from './models/parser/payment'

var allPayments = function (tx:TransactionStream) {
  var payment:PaymentInterface = {
      source_balance_changes : new Array()
  };
  var amount: string | {value: string}
  var balanceChanges: any;

  if (  tx.engine_result !== 'tesSUCCESS' ) return undefined;
  if (  tx.meta && tx.meta.TransactionResult !== 'tesSUCCESS' ) return undefined;

  if (tx.transaction.TransactionType !== 'Payment') {
    return null;
  }

  //ignore 'convert' payments
  if (tx.transaction.Account === tx.transaction.Destination) {
    return null;
  }

  //parse balance changes
  balanceChanges = parseBalanceChanges(tx.meta);

  payment.source      = tx.transaction.Account;
  payment.destination = tx.transaction.Destination;
  payment.destination_balance_changes = balanceChanges[tx.transaction.Destination];

  balanceChanges[tx.transaction.Account].forEach(function(change:any) {
    if (change.currency === 'XRP') {
      if (tx.transaction.Fee) {
        var fee = dropsToXrp(new BigNumber(tx.transaction.Fee).negated());
        change.value = new BigNumber(change.value).minus(fee).toString();
      } else {change.value = new BigNumber(change.value).toString();}
    }

    if (change.value !== '0') payment.source_balance_changes.push(change);
  });

  if (tx.transaction.DestinationTag) payment.destination_tag = tx.transaction.DestinationTag;
  if (tx.transaction.SourceTag) payment.source_tag = tx.transaction.SourceTag;
  if (tx.transaction.InvoiceID) payment.invoice_id = tx.transaction.InvoiceID;

  //destination amount and currency
  if (typeof tx.transaction.Amount === 'object') {
    payment.currency = tx.transaction.Amount.currency;
    payment.amount   = tx.transaction.Amount.value;

  } else {
    payment.currency = 'XRP';
    payment.amount   = dropsToXrp(new BigNumber(tx.transaction.Amount)).toString();
  }

  //delivered amount fields
  if (tx.meta) {
      amount = tx.meta.DeliveredAmount || tx.transaction.Amount;
      if (typeof amount === 'object') {
        payment.delivered_amount = amount.value;

      } else {
        payment.delivered_amount = dropsToXrp(new BigNumber(amount)).toString();
      }
  }

  //max amount
  if (typeof tx.transaction.SendMax === 'object') {
    payment.max_amount      = tx.transaction.SendMax.value;
    payment.source_currency = tx.transaction.SendMax.currency;

  } else if (tx.transaction.SendMax) {
    payment.max_amount      = dropsToXrp(new BigNumber(tx.transaction.SendMax)).toString();
    payment.source_currency = 'XRP';
  }

  if (!payment.source_currency && payment.source_balance_changes.length &&
    typeof payment.source_balance_changes[0] == "object") {
    payment.source_currency = payment.source_balance_changes[0].currency;
  }

  //set Issuer
    var node : any;
    var balance : number;
    var previous : number;
    var high : string;
    var low : string;
    var affNode : any;

    if (tx.transaction.TransactionType !== 'Payment'
        || tx.transaction.Account === tx.transaction.Destination
        || payment.currency === 'XRP' ) return;


    if (typeof tx.transaction.Amount == "object" 
        && payment.source !== tx.transaction.Amount.issuer   
        && payment.destination !== tx.transaction.Amount.issuer) {
          
          payment.issuer = tx.transaction.Amount.issuer;
          return;
    }


    if (tx.meta) {
      tx.meta.AffectedNodes.forEach((n, i) => {
          affNode = n;

          if (affNode.ModifiedNode || affNode.DeletedNode || affNode.ModifiedNode) {
              node = affNode.ModifiedNode || affNode.DeletedNode || affNode.ModifiedNode
          }

          if (  node.LedgerEntryType !== 'RippleState'
                || !node.FinalFields
                || node.FinalFields.HighLimit.currency !== payment.currency) return;

          high = node.FinalFields.HighLimit.issuer;
          low  = node.FinalFields.LowLimit.issuer;

          // destination balance changes
          if (high === payment.destination || low === payment.destination) {
              balance = parseFloat(node.FinalFields.Balance.value);
              
              previous = node.PreviousFields ?
                parseFloat(node.PreviousFields.Balance.value) : 0;

              // if the balance is negative,
              // or was negative previous to this tx,
              // the lowLimit account is the issuer
              if (balance < 0 || previous < 0) { payment.issuer = low } 
              else {
                payment.issuer = high;
              }

              return;
          }
      })
    }

    payment.ledger_index = tx.ledger_index;
    payment.time = tx.transaction.date;
    payment.tx_hash = tx.transaction.hash;

    if (tx.transaction.Fee) payment.fee = dropsToXrp(new BigNumber(tx.transaction.Fee)).toString();

    return payment;
}

export { allPayments };
