import * as items from '../services/items.service.js';

const allowed = new Set(['pending', 'done']);

function validateCreate(body) {
  const errors = [];
  if (typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('name es requerido y debe ser string no vacío');
  }
  if (body.status !== undefined) {
    const s = String(body.status).toLowerCase();
    if (!allowed.has(s)) errors.push("status debe ser 'pending' o 'done'");
  }
  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('description debe ser string');
  }
  return errors;
}

function validateUpdate(body) {
  const errors = [];
  if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim() === '')) {
    errors.push('name debe ser string no vacío');
  }
  if (body.status !== undefined) {
    const s = String(body.status).toLowerCase();
    if (!allowed.has(s)) errors.push("status debe ser 'pending' o 'done'");
  }
  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('description debe ser string');
  }
  return errors;
}

export async function list(req, res, next) {
  try {
    const { q } = req.query;
    const data = await items.list(q);
    res.json(data);
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const errors = validateCreate(req.body);
    if (errors.length) return res.status(422).json({ error: 'ValidationError', details: errors });

    const { name, description = '', status = 'pending' } = req.body;
    const item = await items.create({
      name: name.trim(),
      description,
      status: String(status).toLowerCase(),
      userId: req.user?.id
    });
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const errors = validateUpdate(req.body);
    if (errors.length) return res.status(422).json({ error: 'ValidationError', details: errors });

    const id = req.params.id;
    const patch = { ...req.body };
    if (patch.name) patch.name = patch.name.trim();
    if (patch.status) patch.status = String(patch.status).toLowerCase();

    const updated = await items.update(id, patch);
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const id = req.params.id;
    const ok = await items.remove(id);
    if (!ok) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) { next(e); }
}

