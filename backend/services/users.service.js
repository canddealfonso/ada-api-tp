import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { readJson, writeJson, ensureFile } from '../utils/fileDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const USERS_PATH = path.join(DATA_DIR, 'users.json');

await ensureFile(USERS_PATH, { users: [] });

export async function findByEmail(email) {
  const db = await readJson(USERS_PATH);
  const lower = (email || '').toLowerCase();
  return (db.users || []).find(u => (u.email || '').toLowerCase() === lower) || null;
}

export async function create({ email, passwordHash, name }) {
  const db = await readJson(USERS_PATH);
  const user = {
    id: uuidv4(),
    email,
    passwordHash,
    name: name || '',
    createdAt: new Date().toISOString()
  };
  db.users = db.users || [];
  db.users.push(user);
  await writeJson(USERS_PATH, db);
  return user;
}
