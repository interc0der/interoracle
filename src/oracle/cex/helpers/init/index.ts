import { binance } from './exchanges/binance.init';
import { binanceus } from './exchanges/binanceus.init';
import { bitfinex } from './exchanges/bitfinex.init';
import { bitso } from './exchanges/bitso.init';
import { bitstamp } from './exchanges/bitstamp.init';
import { coinbase } from './exchanges/coinbase.init';
import { crypto } from './exchanges/crypto.init';
import { ftx } from './exchanges/ftx.init';
import { gate } from './exchanges/gate.init';
import { huobi } from './exchanges/huobi.init';
import { kraken } from './exchanges/kraken.init';
import { kucoin } from './exchanges/kucoin.init';
import { okex } from './exchanges/okex.init';
import { poloniex } from './exchanges/poloniex.init';

interface IExchangeDir {
[index: string]:(input: string[]) => (string | string[])[] | Promise<(string | string[])[]>
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
    "GATE": gate, 
    "HUOBI": huobi, 
    "KRAKEN": kraken, 
    "KUCOIN": kucoin, 
    "OKEX": okex, 
    "POLONIEX": poloniex, 
};

export default index