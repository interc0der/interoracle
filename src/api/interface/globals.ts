declare global {
    namespace NodeJS {
      export interface ProcessEnv {
        API_PORT: string;
        OKEX_KEY: string;
        OKEX_SECRET: string;
        OKEX_PASS: string;
        XAPP_SECRET:string;
        API_KEY:string;
        API_SECRET:string
      }
    }
  }

declare global {
  namespace Express {
    interface Request {
      xummAuthHeaders: any 
      user:any
    }
  }
}

export {}