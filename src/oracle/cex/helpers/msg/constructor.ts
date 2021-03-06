import { readdirSync } from 'fs';
import fs from 'fs';
import path from 'path';

const SOURCE_FOLDER = './exchanges'

// some helpful functions
const isFolder = file => file.split('.')[1];

const toPascalCase = string =>
  string
    .match(/[a-z]+/gi)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join('');


// getting all the folder
const exchanges = readdirSync(SOURCE_FOLDER)
    .map(file => file.split('.')[0])

var mapContent = [
    exchanges
        .map((exchange) => {
        return "import { " + exchange + " } from './exchanges/" + exchange + ".msg';";
    })
        .join('\n'),
    '',
    'interface IExchangeDir {',
        '[index: string]:',
        '(ws: WebSocket, evt: any, channels: string[], pairs: string[], type: string, sequence: number, id: string, tickers: string[][]) =>',
        '{type: string; symbol_id: string; sequence: number; time_exchange: number | undefined; time_interoracle: number; uuid: string; price: number;size: number | undefined; taker_side: string | undefined; }| undefined}',
    '',
    'const index:IExchangeDir =  {',
    exchanges
        .map((folder) => { return "\"" + folder.toUpperCase() + "\": " + folder + ", "; }).join('\n'),
    '};',
    '',
    'export default index'
].join('\n');

fs.writeFileSync("./index.ts", mapContent);
