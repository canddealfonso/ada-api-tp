import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import usersRouter from './routes/users.routes.js';
import itemsRouter from './routes/items.routes.js';
import errorHandler from './middleware/errorHandler.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { readFileSync, existsSync } from 'fs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

const openapiPath = path.join(__dirname, '..', 'ada-api-tpi-openapi.yaml');
let openapiDoc;

try {
  if (existsSync(openapiPath)) {
    const openapiText = readFileSync(openapiPath, 'utf8');
    openapiDoc = YAML.parse(openapiText);
    console.log(`Docs: usando OpenAPI en ${openapiPath}`);
  } else {
    console.warn(`Docs: no se encontró ${openapiPath}. Cargando spec mínima para /docs`);
    openapiDoc = {
      openapi: '3.0.3',
      info: { title: 'TPI API (Spec mínima)', version: '1.0.0' },
      servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
      paths: {
        '/health': { get: { summary: 'Salud', responses: { '200': { description: 'OK' } } } },
      },
    };
  }
} catch (err) {
  console.error('Docs: error cargando OpenAPI, usando spec mínima:', err);
  openapiDoc = {
    openapi: '3.0.3',
    info: { title: 'TPI API (Spec mínima)', version: '1.0.0' },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    paths: {
      '/health': { get: { summary: 'Salud', responses: { '200': { description: 'OK' } } } },
    },
  };
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
  console.log(`Docs disponibles en     http://localhost:${PORT}/docs`);
});
