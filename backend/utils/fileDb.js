import { promises as fs } from 'fs';
import path from 'path';

export async function ensureFile(filePath, defaultData) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch (e) {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

export async function readJson(filePath) {
  await ensureFile(filePath, {});
  const str = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(str || '{}');
}

export async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmpPath = filePath + '.tmp';
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmpPath, filePath);
}
