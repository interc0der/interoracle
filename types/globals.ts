declare global {
    namespace NodeJS {
      export interface ProcessEnv {
        API_PORT: string;
        OKEX_KEY: string;
        OKEX_SECRET: string;
        OKEX_PASS: string;
        API_SECRET:string
      }
    }
  }

export {}