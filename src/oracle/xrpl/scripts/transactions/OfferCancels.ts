import { allOffers } from '../all/allOffers'
import { TransactionStream } from '../../models/methods/subscribe';

const OfferCancels = (tx:TransactionStream) => {
  
        const offers = allOffers(tx) 

        if (Array.isArray(offers) && offers.length > 0 ) {
            let filter = offers.filter( offer => offer.change_type == 'cancel') 

            if (Array.isArray(filter) && filter.length > 0 ) return filter
        }
}

export { OfferCancels }