import { Router } from 'express';
import { list, create, update, remove } from '../controllers/items.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// GET /items
router.get('/', list);

// POST /items (protegido)
router.post('/', authRequired, create);

// PUT /items/:id (protegido)
router.put('/:id', authRequired, update);

// DELETE /items/:id (protegido)
router.delete('/:id', authRequired, remove);

export default router;
