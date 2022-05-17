import Interoracle, { initialize }  from './interoracle';

export const init = (peer, request) => {
  let sockets = initialize(peer, request)
  return sockets
}
