import { Router } from 'express';
import { register, login } from '../controllers/users.controller.js';

const router = Router();

// POST /users/register
router.post('/register', register);

// POST /users/login
router.post('/login', login);

export default router;
