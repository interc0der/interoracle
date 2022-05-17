export interface Peer {
    socket: any;
    id: string;
    timerId: number;
    lastBeat: number;
}
