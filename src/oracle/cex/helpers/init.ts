import axios from 'axios';

const binance = (input:string[]) => {
    let channels:string[] = [];

    for (let i = 1; i<input.length; i++) {
      channels.push((input[i][2]+input[i][3]).toLowerCase());
    }

    var endpointPath = '';
        for (let i=0; i < channels.length; i++ ) {
          if (i===0) {
              endpointPath += channels[i]+"@trade";
          } else {
              endpointPath += "/"+channels[i]+"@trade";
          }
      };

    let url:string = `wss://stream.binance.com:9443/stream?streams=${endpointPath}`

    return [channels, url]
}

const binanceUS = (input:string[]) => {

    let channels:string[] = [];
    for (let i = 1; i<input.length; i++) {
      channels.push((input[i][2]+input[i][3]).toLowerCase());
    }
    
    var endpointPath = '';
    for (let i=0; i < channels.length; i++ ) {
        if (i===0) {
            endpointPath += channels[i]+"@trade";
        } else {
            endpointPath += "/"+channels[i]+"@trade";
        }
    };
    let url:string = `wss://stream.binance.us:9443/stream?streams=${endpointPath}`

    return [channels, url]
}

const bitso = (input:string[]) => {

    let channels:string[] = [];
    for (let i = 1; i<input.length; i++) {
      channels.push((input[i][2]+"_"+input[i][3]).toLowerCase());
    }

    let url:string = `wss://ws.bitso.com`

    return [channels, url]
}

const bitstamp = (input:string[]) => {

    let channels:string[] = [];
    for (let i = 1; i<input.length; i++) {
      channels.push((input[i][2]+input[i][3]).toLowerCase());
    }

    const url = 'wss://ws.bitstamp.net'
    
    const listenToCurrancies = channels.map(pair => {
                return ("live_trades"+"_"+pair)
    })

    return [listenToCurrancies, url]
}

const kraken = (input:any[]) => {

    let channels:string[] = [];
    for (let i = 1; i<input.length; i++) {

      if (input[i][2] == "BTC") { input[i][2]="XBT" }
      if (input[i][2] == "DOGE") { input[i][2]="XDG" }

      channels.push(input[i][2]+"/"+input[i][3]);
    }

    let url:string = 'wss://ws.kraken.com';

    return [channels, url]
}

const coinbase = (input:string[]) => {

    let channels:string[] = [];
    for (let i = 1; i<input.length; i++) {
      channels.push(input[i][2]+"-"+input[i][3]);
    }
    let url:string = 'wss://ws-feed.pro.coinbase.com';


    return [channels, url]
}

const kucoin = async (input:string[]) => {

    let channels:string[] = [];
    for (let i = 1; i<input.length; i++) {
      channels.push(input[i][2]+"-"+input[i][3]);
    }

    let auth_url = "https://api.kucoin.com/api/v1/bullet-public"
          
    async function init () {
        const resp = await axios.post ( auth_url ) ;
        return resp.data.data.token
    }

    let authkey = await init();
    let connectId = 1545910660739
        
    let url:string = `wss://ws-api.kucoin.com/endpoint?token=${authkey}&[connectId=${connectId}]`;
        
    return [channels, url]
}

const ftx = (input:string[]) => {

    let channels:string[] = [];
    for (let i = 1; i<input.length; i++) {
      channels.push((input[i][2]+"/"+input[i][3]))
    }

    const url = 'wss://ftx.com/ws/';

    return [channels, url]
}

const huobi = (input:string[]) => {

    let channels:string[] = [] 
    for (let i = 1; i<input.length; i++) {
      channels.push((input[i][2]+input[i][3]).toLowerCase());
    }

    let url:string = `wss://api.huobi.pro/ws`

    return [channels, url]
}

const cryptoX = (input:string[]) => {

    let channels:string[] = []
    for (let i = 1; i<input.length; i++) {
          channels.push((input[i][2]+"_"+input[i][3]))
    }
    let url:string = 'wss://stream.crypto.com/v2/market';
    let handledChannel = channels.map(ticker => {return `trade.${ticker}`} )
    
    return [handledChannel, url]
}

const gate = (input:string[]) => {

    let channels:string[] = [] = []
    for (let i = 1; i<input.length; i++) {
          channels.push((input[i][2]+"_"+input[i][3]))
    }

    let url:string = `wss://ws.gate.io/v4`

    return [channels, url]
}

const okex = (input:string[]) => {

    let channels:string[] = []
    for (let i = 1; i<input.length; i++) {
          channels.push((input[i][2]+"-"+input[i][3]))
    }

    let url:string = `wss://ws.okx.com:8443/ws/v5/public`

    return [channels, url]
}


const bitfinex = (input:string[]) => {

    let channels:string[] = []
    for (let i = 1; i<input.length; i++) {
           channels.push((input[i][2]+input[i][3]))
    }

    const url = `wss://api.bitfinex.com/ws/1`


    return [channels, url]
}

const poloniex = async (input:string[]) => {


    let channels:string[] = []
    for (let i = 1; i<input.length; i++) {
      channels.push(input[i][3]+"_"+input[i][2])
    }

    let url:string = `wss://api2.poloniex.com`

    //const poloniex_api = "https://poloniex.com/public?command=returnTicker"
    //const poloniex_id = await axios.get ( poloniex_api ) ;
    //const idArray = Object.entries(poloniex_id.data);

/*     let tickerKey =  channels.map((ticker) => {
            let returnData
            let index = idArray.find((entry) => entry[0] == ticker)

            if (index == undefined ) {
                returnData = [ticker, null]
            } else {
                returnData = [ticker, index[1].id]
            } 
            return returnData
    }) */
                
    return [channels, url]
}

const init = {
    binance,
    binanceUS,
    bitso,
    bitstamp,
    kraken,
    coinbase,
    kucoin,
    ftx,
    huobi,
    cryptoX,
    gate,
    okex,
    bitfinex,
    poloniex
}

export default init