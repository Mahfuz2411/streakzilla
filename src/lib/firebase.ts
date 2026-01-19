// Firebase setup - ready for user auth + online sync
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from "firebase/firestore";
import { firebaseEnv } from "@/config/env";

const app = initializeApp(firebaseEnv);
export const auth = getAuth(app);

// Setup Firestore with offline persistence (modern approach)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({}),
  }),
});