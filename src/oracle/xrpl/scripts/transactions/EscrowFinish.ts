import { allEscrows } from '../all/allEscrows'
import { TransactionStream } from './../../models/methods/subscribe';

const EscrowFinish = (tx:TransactionStream) => {
  
        const escrows:any = allEscrows(tx) 

        if (Array.isArray(escrows) && escrows.length > 0 ) {
            let filter = escrows.filter( escrow => escrow.tx_type == "EscrowFinish") 

            if (Array.isArray(filter) && filter.length > 0 ) return filter
        }
}

export { EscrowFinish }