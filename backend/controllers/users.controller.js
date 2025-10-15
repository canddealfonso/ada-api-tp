import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as users from '../services/users.service.js';

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son requeridos' });
    }
    const exists = await users.findByEmail(email);
    if (exists) {
      return res.status(409).json({ error: 'Usuario ya existe' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await users.create({ email, passwordHash: hash, name: name || '' });
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email y password son requeridos' });
    const user = await users.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token });
  } catch (err) { next(err); }
}
