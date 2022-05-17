import { binance } from './exchanges/binance.msg';
import { binanceus } from './exchanges/binanceus.msg';
import { bitfinex } from './exchanges/bitfinex.msg';
import { bitso } from './exchanges/bitso.msg';
import { bitstamp } from './exchanges/bitstamp.msg';
import { coinbase } from './exchanges/coinbase.msg';
import { crypto } from './exchanges/crypto.msg';
import { ftx } from './exchanges/ftx.msg';
import { gateio } from './exchanges/gateio.msg';
import { huobipro } from './exchanges/huobipro.msg';
import { kraken } from './exchanges/kraken.msg';
import { kucoin } from './exchanges/kucoin.msg';
import { okex } from './exchanges/okex.msg';
import { poloniex } from './exchanges/poloniex.msg';

interface IExchangeDir {
[index: string]:
(ws: WebSocket, evt: any, channels: string[], pairs: string[], type: string, sequence: number, id: string, tickers: string[][]) => 
{type: string; symbol_id: string; sequence: number; time_exchange: number | undefined; time_interoracle: number; uuid: string; price: number;size: number | undefined; taker_side: string | undefined; }| undefined}

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