import { PriceArrayType, GrossPriceArrayType } from "src/interface/request";

/**
 * 
 * Process grouped price data feeds and condense down to single entry
 * 
 * @param {Array} input // Array of prices, trade amounts, assigned weights, timestamps
 * @returns {number} // Weighted average price based on trade amount, user assigned weights, and (optional) time decay
 */
const gross_weighted_average_price = (input:GrossPriceArrayType[]) => {
    var weights = [];
    var values = [];
    var weighted_total = 0;
    var total_value = 0;
    var decay = 10000000; 
    //if staleTime = 2000 ms, max reduction == 0.770
    //if staleTime = 5000 ms, max reduction == 0.630
    //if staleTime = 10000 ms, max reduction == 0.400


    for (var i = 0; i < input.length; i++) {
        weights.push(
            input[i].price * 
            input[i].amount * 
            //((parseFloat(input[i].time)/parseFloat(input[input.length-1].time))**decay) *  //Ratio of timestamps, linear decay
            input[i].weight //Takes into account weight of exchange between 0 and 1
        );
        
        values.push(
            input[i].amount * 
            //((parseFloat(input[i].time)/parseFloat(input[input.length-1].time))**decay) * //Ratio of timestamps, linear decay
            input[i].weight //Takes into account weight of exchange between 0 and 1
        );
    }

    for (var i = 0; i < weights.length; i++) {
        weighted_total += weights[i];
        total_value += values[i];
    }

    return weighted_total / total_value;
}


/**
 * 
 * Process grouped price data feeds and condense down to single entry
 * 
 * @param {Array} input // Array of prices and trade amounts
 * @returns {number} //Weighted average price based on trade amount
 */
const weighted_average = (input:PriceArrayType[]) => {
    var weights = [];
    var values = [];
    var weighted_total = 0;
    var total_value = 0;
  
  
    for (var i = 0; i < input.length; i++) {
        weights.push((input[i].price) * input[i].amount);
        values.push(input[i].amount);
    }
  
    for (var i = 0; i < weights.length; i++) {
        weighted_total += weights[i];
        total_value += values[i];
    }
  
    return weighted_total / total_value;
  }

  const utils = {
      weighted_average,
      gross_weighted_average_price
  }

  export default utils;



