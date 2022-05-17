import { binance } from './exchanges/binance.open';
import { binanceus } from './exchanges/binanceus.open';
import { bitfinex } from './exchanges/bitfinex.open';
import { bitso } from './exchanges/bitso.open';
import { bitstamp } from './exchanges/bitstamp.open';
import { coinbase } from './exchanges/coinbase.open';
import { crypto } from './exchanges/crypto.open';
import { ftx } from './exchanges/ftx.open';
import { gateio } from './exchanges/gateio.open';
import { huobipro } from './exchanges/huobipro.open';
import { kraken } from './exchanges/kraken.open';
import { kucoin } from './exchanges/kucoin.open';
import { okex } from './exchanges/okex.open';
import { poloniex } from './exchanges/poloniex.open';

interface IExchangeDir {
[index: string]:(ws: WebSocket, channels: string[]) => void
}

const index:IExchangeDir =  {
    "BINANCE": binance, 
    "BINANCEUS": binanceus, 
    "BITFINEX": bitfinex, 
    "BITSO": bitso, 
    "BITSTAMP": bitstamp, 
    "COINBASE": coinbase, 
    "CRYPTO": crypto, 
    "FTX": ftx, 
    "GATEIO": gateio, 
    "HUOBIPRO": huobipro, 
    "KRAKEN": kraken, 
    "KUCOIN": kucoin, 
    "OKEX": okex, 
    "POLONIEX": poloniex, 
};

export default index