export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      API_URL: string;
      NODE_ENV: string;
      PUBLIC_URL: string;
      REACT_APP_URL_PICTOGRAMAS: string;
      REACT_APP_URL_ARASAAC: string;
      REACT_APP_ENCRYPT_KEY: string;
    };
  }
}