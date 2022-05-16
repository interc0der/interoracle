import db from '../helpers/db';

const intervals = [ 'year', 'day', 'hour', 'minute', 'second','millisecond']

const getPriceAtInterval = async (
     { tickers, interval, unit, page, range}:
    { tickers:string[], interval:number, unit:string, page:number, range: number[]} 
) => {
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
                'timestamp': '$timestamp',
                'time': {
                  '$subtract': subtrack
                }, 
                'exchange': '$metadata.exchange'
              }
            }, 
            {
              '$match': {
                '$or': matchArray,
                'timestamp': {         
                  '$gte': new Date('2022-05-15T00:00:00Z'),
                  '$lt': new Date('2022-05-15T24:00:00Z')
                  }
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
          }, {
            '$skip': (page-1)*50
          }, {
            '$limit': 50
          } 
        ]
    );
    return time  
}


const getLatestPriceFromExchange = async () => {
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
          'mil': {
            '$millisecond': '$timestamp'
          }, 
          'ticker': 1, 
          'timestamp': 1, 
          'price': 1, 
          'exchange': '$metadata.exchange'
        }
      }, {
        '$match': {
          '$or': [
            {
              'ticker': 'BTC_USDT'
            }
          ], 
          'exchange': 'BINANCE'
        }
      }, {
        '$group': {
          '_id': {
            'ticker': '$ticker'
          }, 
          'price': {
            '$last': '$price'
          },
          'timestamp': {
            '$last':'$timestamp'
          }
        }
      }
    ]    
 );  

 return time
}





/* getPriceAtInterval(
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
) */

var i=0
//setInterval( async () => {console.log(await getLatestPriceFromExchange())}, 5000)
setInterval( async () => {
  i+=1
  console.log( await getPriceAtInterval(
    {
   tickers:[
     "BTC_USDT", 
     "BTC_USD",
     "BTC_BUSD",
     "BTC_USDC"
   ], 
   interval: 1, 
   unit: 'minute',
   page: i,
   range: [ Date.now()-5000, Date.now() ]
} )
) }
  , 5000)

