// src/lib/db.ts
import { openDB } from "idb";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
  peakStreak?: number;
  lastCompleted: string | null;
  createdAt: string;
  updatedAt: string; // sync/conflict এর জন্য দরকার
}

const DB_NAME = "streakzilla";
const STORE = "tasks";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db: any) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: "id" });
    }
  },
});

export async function getAllTasks(): Promise<Task[]> {
  const db = await dbPromise;
  return (await db.getAll(STORE)) as Task[];
}

export async function upsertTasks(tasks: Task[]): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction(STORE, "readwrite");
  await Promise.all(tasks.map((t) => tx.store.put(t)));
  await tx.done;
}

export async function clearTasks(): Promise<void> {
  const db = await dbPromise;
  await db.clear(STORE);
}