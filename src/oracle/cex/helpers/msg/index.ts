import { binance } from './exchanges/binance.msg';
import { binanceus } from './exchanges/binanceus.msg';
import { bitfinex } from './exchanges/bitfinex.msg';
import { bitso } from './exchanges/bitso.msg';
import { bitstamp } from './exchanges/bitstamp.msg';
import { coinbase } from './exchanges/coinbase.msg';
import { crypto } from './exchanges/crypto.msg';
import { ftx } from './exchanges/ftx.msg';
import { gate } from './exchanges/gate.msg';
import { huobi } from './exchanges/huobi.msg';
import { kraken } from './exchanges/kraken.msg';
import { kucoin } from './exchanges/kucoin.msg';
import { okex } from './exchanges/okex.msg';
import { poloniex } from './exchanges/poloniex.msg';

interface IExchangeDir {
[index: string]:
(evt: any, channels: string[], pairs: any, type: string, sequence: number, id: string, ws?:any) => 
{
type: string; 
symbol_id: any; 
sequence: number; 
time_exchange: any; 
time_wakedapi: number; 
uuid: string; 
price: number;
size: number; 
taker_side: string; }
| undefined
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