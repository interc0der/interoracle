declare global {
    namespace NodeJS {
      export interface ProcessEnv {
        API_PORT: string;
      }
    }
  }

export {}