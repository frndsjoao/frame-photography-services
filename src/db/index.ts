import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let db: Firestore | undefined;

export function getDb(): Firestore {
  if (!db) {
    if (getApps().length === 0) {
      initializeApp();
    }
    db = getFirestore();
  }
  return db;
}

export const Collections = {
  USERS: "users",
  CLIENTS: "clients",
  PACKAGES: "packages",
} as const;
