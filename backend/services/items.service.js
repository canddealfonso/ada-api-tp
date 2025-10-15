import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { readJson, writeJson, ensureFile } from '../utils/fileDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const ITEMS_PATH = path.join(DATA_DIR, 'items.json');

await ensureFile(ITEMS_PATH, { items: [] });

export async function list(q) {
  const db = await readJson(ITEMS_PATH);
  let items = db.items || [];
  if (q && q.trim() !== '') {
    const needle = q.toLowerCase();
    items = items.filter(i =>
      (i.name && i.name.toLowerCase().includes(needle)) ||
      (i.description && i.description.toLowerCase().includes(needle)) ||
      (i.status && i.status.toLowerCase().includes(needle))
    );
  }
  return items;
}

export async function create({ name, description, status, userId }) {
  const db = await readJson(ITEMS_PATH);
  const item = {
    id: uuidv4(),
    name,
    description,
    status,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };
  db.items = db.items || [];
  db.items.push(item);
  await writeJson(ITEMS_PATH, db);
  return item;
}

export async function update(id, patch) {
  const db = await readJson(ITEMS_PATH);
  const idx = (db.items || []).findIndex(i => i.id === id);
  if (idx === -1) return null;
  const prev = db.items[idx];
  const updated = { ...prev, ...patch, id: prev.id, updatedAt: new Date().toISOString() };
  db.items[idx] = updated;
  await writeJson(ITEMS_PATH, db);
  return updated;
}

export async function remove(id) {
  const db = await readJson(ITEMS_PATH);
  const before = (db.items || []).length;
  db.items = (db.items || []).filter(i => i.id !== id);
  const after = db.items.length;
  if (after === before) return false;
  await writeJson(ITEMS_PATH, db);
  return true;
}
