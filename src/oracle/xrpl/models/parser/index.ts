import { TxResponse } from "../methods/tx"
import { TransactionStream } from "../methods/subscribe"
import { TransactionEntryResponse } from "../methods/transactionEntry"

export type modTxResponse = TxResponse 

export type modTransactionStream = TransactionStream 

export type modTransactionEntryResponse = TransactionEntryResponse

export type txParserInterface = modTxResponse | modTransactionStream | modTransactionEntryResponse
