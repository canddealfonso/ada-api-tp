# Trabajo Práctico Integrador — API RESTful (Node.js + Express)

API con CRUD de `items`, registro/login con JWT, validaciones con **422**, manejo centralizado de errores,
búsqueda **case-insensitive** y **documentación en Swagger UI**.

## Cómo correr localmente
```bash
npm install
npm i swagger-ui-express yaml   # dependencias para /docs
cp .env.example .env            # definí JWT_SECRET
npm run dev                     # o npm start
# abrir:
# - http://localhost:3000/health
# - http://localhost:3000/docs  (Swagger UI)
```

## Autenticación
1. `POST /users/register`
2. `POST /users/login`  → devuelve `{ token }`
3. En rutas protegidas (`POST|PUT|DELETE /items`) enviar `Authorization: Bearer <token>`

## Documentación
- **Swagger UI:** `GET /docs`
- **OpenAPI YAML:** `ada-api-tpi-openapi.yaml` (lo usa /docs)
- **Postman:** `ada-api-tpi-postman.json` (opcional)

## Endpoints principales
- `GET /items?q=` — búsqueda case-insensitive en name/description/status
- `POST /items` — **requiere JWT**, valida `status: pending|done` y `name` no vacío (**422**)
- `PUT /items/:id` — **requiere JWT**, mismas validaciones (**422**)
- `DELETE /items/:id` — **requiere JWT** (204 cuando elimina, 404 si no existe)

## Despliegue en Render
1. Subí el repo a GitHub (**no** subas `.env`).
2. En **Render → New → Web Service** desde el repo.
3. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `node backend/index.js`
   - **Environment Variables:** `JWT_SECRET` (y opcional `PORT`)
4. Probar en la URL pública:
   - `/health`
   - `/docs`  ← **Documentación viva**
   - Flujo completo de login + CRUD

> Si usás `PORT` custom en Render, `/docs` seguirá funcionando porque el server lee el YAML con ruta relativa.

## Estructura
```
backend/
  controllers/   # lógica de endpoints
  middleware/    # auth JWT + error handler
  routes/
  services/      # capa de datos (JSON)
  utils/
public/          # mini-frontend estático (opcional)
ada-api-tpi-openapi.yaml
```
