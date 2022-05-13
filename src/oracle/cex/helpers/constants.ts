const trackedCurrencies = ['XRP','LTC','ADA','ALGO','BTC','ETH','BCH','DOGE','XLM','DGB','FIL']

const trackedExchanges = [
    "BINANCE",
    "BINANCEUS",
    "COINBASE",
    "KUCOIN",
    "KRAKEN",
    "BITSTAMP",
    "BITSO",
    "FTX",
    "HUOBIPRO",
    "CRYPTO",
    "GATEIO",
    "OKEX",
    "BITFINEX",
    "POLONIEX"
]

const dataTypes = [
    "trade", 	
    "quote", 	
    "book", 	
    "book5", 	
    "book20", 	
    "book50", 	
    "ohlcv", 	
    "volume", 	
    "exrate", 	
]

interface binanceWeightsType {
    [index: string]:any
}

const binanceWeights:binanceWeightsType = {
    XRP: 18,
    LTC: 15,
    BTC: 10,
    ALGO: 40,
    ETH: 30,
    ADA: 10,
    BCH: 18,
    DGB: 50,
    FIL: 24,
    XLM: 27,
    DOGE: 8
}

const constants = {
    trackedCurrencies,
    trackedExchanges,
    dataTypes,
    binanceWeights
}

export default constants