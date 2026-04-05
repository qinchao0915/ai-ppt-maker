import { openDB, DBSchema, IDBPDatabase } from "idb";
import { ProjectRecord } from "@/types";

interface PptDB extends DBSchema {
  projects: {
    key: string;
    value: ProjectRecord;
    indexes: { "by-deviceId": string; "by-updatedAt": string };
  };
}

const DB_NAME = "ai-ppt-maker";
const DB_VERSION = 1;

async function getDB(): Promise<IDBPDatabase<PptDB>> {
  return openDB<PptDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore("projects", { keyPath: "id" });
      store.createIndex("by-deviceId", "deviceId");
      store.createIndex("by-updatedAt", "updatedAt");
    },
  });
}

export async function saveProject(project: ProjectRecord): Promise<void> {
  const db = await getDB();
  await db.put("projects", project);
}

export async function getProjects(deviceId: string): Promise<ProjectRecord[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("projects", "by-deviceId", deviceId);
  return all
    .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
    .slice(0, 20);
}

export async function getProject(id: string): Promise<ProjectRecord | undefined> {
  const db = await getDB();
  return db.get("projects", id);
}
