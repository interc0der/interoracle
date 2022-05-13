import { allPayments } from '../all/allPayments'
import { TransactionStream } from './../../models/methods/subscribe';

const Payment = (tx:TransactionStream) => {
  
        const payments = allPayments(tx) 

        if (Array.isArray(payments) && payments.length > 0 ) {
            let filter = payments.filter( payment => payment.tx_type  == 'Payment') 

            if (Array.isArray(filter) && filter.length > 0 ) return filter
        }
}

export { Payment }