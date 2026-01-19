// IndexedDB setup for persisting tasks locally
import { openDB } from "idb";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
  peakStreak?: number;
  lastCompleted: string | null;
  createdAt: string;
  updatedAt: string; // Track when task was last modified
}

const DB_NAME = "streakzilla";
const STORE = "tasks";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db: any) {
    // Create tasks store if it doesn't exist
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: "id" });
    }
  },
});

// Get all tasks from IndexedDB
export async function getAllTasks(): Promise<Task[]> {
  const db = await dbPromise;
  return (await db.getAll(STORE)) as Task[];
}

// Wipe everything and write fresh (for sync purposes)
export async function replaceTasks(tasks: Task[]): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction(STORE, "readwrite");
  await tx.store.clear();
  await Promise.all(tasks.map((t) => tx.store.put(t)));
  await tx.done;
}

// Remove a single task
export async function deleteTask(id: string): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction(STORE, "readwrite");
  await tx.store.delete(id);
  await tx.done;
}

// Clear all tasks (nuclear option)
export async function clearTasks(): Promise<void> {
  const db = await dbPromise;
  await db.clear(STORE);
}