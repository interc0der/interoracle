import { Client } from 'xrpl';

export interface Method {
    client?: Client
    filter?: string|null
    log?: boolean
}