import { Client } from "src/oracle/xrpl/node_modules/xrpl/dist/npm";

export interface Method {
    client: Client
    filter: string
    log: boolean
}