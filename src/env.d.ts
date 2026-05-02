declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  // add other env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
