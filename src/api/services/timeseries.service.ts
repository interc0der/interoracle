import db from '../helpers/db';

const intervals = [ 'year', 'day', 'hour', 'minute', 'second','millisecond']

const getPriceAtInterval = async (
     { tickers, interval, unit}:
    { tickers:string[], interval:number, unit:string} 
) => {
    console.log(`starting aggregation`)

     let matchArray = tickers.map((ticker) => {
         return ({
            'ticker': ticker
          })
    })

    let group = {};
    intervals.forEach((interval, index) => {
        if (intervals.indexOf(unit) <= index) return
        group[interval] = `$${interval}`
    })
    group['time'] ='$time'

    let subtrackObj={}
    subtrackObj[`$${unit}`] = '$timestamp'

    let subtrack = [
            subtrackObj, 
            {
              '$mod': [
                subtrackObj, 
                interval
              ]
            }
          ]

    let index = intervals.indexOf(unit) + 1
    if (index > intervals.length-1) index = intervals.length-1

    let subUnit = intervals[index]
    let parUnit = intervals[index-2]

    console.log('group', group)
    console.log('match', matchArray)
    console.log('subUnit', subUnit)

    console.log(subtrack)
 
     const time = await db.TimeSeries.aggregate(
        [
            {
              '$project': {
                'year': {
                  '$year': '$timestamp'
                }, 
                'month': {
                  '$month': '$timestamp'
                }, 
                'day': {
                  '$dayOfMonth': '$timestamp'
                }, 
                'hour': {
                  '$hour': '$timestamp'
                }, 
                'minute': {
                  '$minute': '$timestamp'
                }, 
                'second': {
                  '$second': '$timestamp'
                }, 
                'millisecond': {
                  '$millisecond': '$timestamp'
                }, 
                'ticker': 1, 
                'price': 1, 
                'time': {
                  '$subtract': subtrack
                }, 
                'exchange': '$metadata.exchange'
              }
            }, 
            {
              '$match': {
                '$or': matchArray
                }
            }, 
            {
              '$group': {
                '_id': group, 
                'interval': {
                  '$first': `$${parUnit}`
                }, 
                'last': {
                  '$last': `$${unit}`
                }, 
                'first': {
                  '$first': `$${unit}`
                }, 
                'avg': {
                  '$avg': '$price'
                }, 
                'close': {
                  '$last': '$price'
                }, 
                'open': {
                  '$first': '$price'
                }
              }
            },           
            {
                '$sort': {
                    'interval': -1, 
                    'first': -1
                }
            } 
        ]
    );  



    console.log('aggregation completed')
    console.log(time)
}


getPriceAtInterval(
     {
    tickers:[
      "BTC_USDT", 
      "BTC_USD",
      "BTC_BUSD",
      "BTC_USDC"
    ], 
    interval: 1, 
    unit: 'minute'
} 
)