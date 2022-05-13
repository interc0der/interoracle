import { allPaymentChannels } from '../allPayChans'
import { TransactionStream } from './../../../models/methods/subscribe';

const PaymentChannelFund = (tx:TransactionStream) => {
  
        const payChans = allPaymentChannels(tx) 

        if (Array.isArray(payChans) && payChans.length > 0 ) {
            let filter = payChans.filter( payChan => payChan.tx_type == "PaymentChannelFund") 

            if (Array.isArray(filter) && filter.length > 0 ) return filter
        }
}

export { PaymentChannelFund }