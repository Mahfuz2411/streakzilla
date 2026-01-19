// Read and validate Firebase config from .env
type EnvKey =
  | "VITE_APIKEY"
  | "VITE_authDomain"
  | "VITE_projectId"
  | "VITE_storageBucket"
  | "VITE_messagingSenderId"
  | "VITE_appId"
  | "VITE_measurementId";

// Helper to safely read env vars and throw if missing
const readEnv = (key: EnvKey): string => {
  const value = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

// Export Firebase config object
export const firebaseEnv = {
  apiKey: readEnv("VITE_APIKEY"),
  authDomain: readEnv("VITE_authDomain"),
  projectId: readEnv("VITE_projectId"),
  storageBucket: readEnv("VITE_storageBucket"),
  messagingSenderId: readEnv("VITE_messagingSenderId"),
  appId: readEnv("VITE_appId"),
  measurementId: readEnv("VITE_measurementId"),
};