/// <reference types="vite/client" />

// Augmentamos la interfaz que Vite expone para `import.meta.env`.
// Así TypeScript conoce nuestras variables VITE_* (autocompletado + chequeo de tipos),
// en vez de tratarlas como `string` genérico sin nombre.
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
