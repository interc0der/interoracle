import { allOffers } from '../allOffers'
import { TransactionStream } from './../../../models/methods/subscribe';

const OfferPartialFills = (tx:TransactionStream) => {
  
        const offers = allOffers(tx) 

        if (Array.isArray(offers) && offers.length > 0 ) {
          return offers.filter( offer => offer.change_type = 'partial_fill' ) 
        }
}

export { OfferPartialFills }