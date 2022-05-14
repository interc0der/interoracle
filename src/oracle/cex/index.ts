import process from './helpers/process';
import { Interoracle }  from './helpers/ws';

export const init = (peer, request, channels) => {
  let array:any = process.organizeByExchange(request)
  process.initializeWS(peer, channels, array)
}
