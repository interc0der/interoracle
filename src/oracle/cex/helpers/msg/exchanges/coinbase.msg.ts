const coinbase = (evt:any, channels:string[], pairs:any, type:string, sequence:number,id:string) => {
    try {

        // Parse message from exchange
        const resp = JSON.parse(evt.data);
        
        // Handle messages that are not trades
        if (resp == undefined) return;
        if (resp.price == undefined) return;
  
        // Process trade message and return to oracle
        let array = channels.map(( ticker:string ) => {
            if(resp.product_id.indexOf(ticker) > -1 ) {
              let asset

              if (ticker.includes('USDT')
              || ticker.includes('USDC')
              || ticker.includes('BUSD')
              ) {
                asset = ticker.slice(0,-5)
              } else {
                asset = ticker.slice(0,-4)
              }

              var base = ticker.replace(asset+"-",'');

               return ({
                "type": type,
                "symbol_id": `COINBASE_SPOT_${asset}_${base}`,
                "sequence": ++sequence,
                "time_exchange": new Date(resp.time).getTime(),
                "time_interoracle": Date.now(),
                "uuid": id,
                "price": parseFloat(resp.price),
                "size": parseFloat(resp.last_size),
                "taker_side": resp.side.toUpperCase()
              })
            }
            return
        })

        return array.filter(Boolean)[0]

    } catch (error) {
      console.log(error)
          return
    }
}
