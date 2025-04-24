// Add TypeScript support for our request extension
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      HOST?: string;
    }
  }
}

declare module 'http' {
  interface IncomingMessage {
    start?: [number, number]; // hrtime tuple for request timing
  }
}

export {};