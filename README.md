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

## Producción (Render)

•⁠  ⁠Base URL: https://ada-api-tp.onrender.com
•⁠  ⁠Docs (Swagger UI): https://ada-api-tp.onrender.com/docs
•⁠  ⁠Healthcheck: https://ada-api-tp.onrender.com/health

### Probar rápido en prod
```bash
# Registrar (si hace falta)
curl -s -X POST https://ada-api-tp.onrender.com/users/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"ada@example.com","password":"123456"}' | jq

# Login (obtiene token)
TOKEN=$(curl -s -X POST https://ada-api-tp.onrender.com/users/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ada@example.com","password":"123456"}' | jq -r .token)

# Crear item (autenticado)
curl -s -X POST https://ada-api-tp.onrender.com/items \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Pedido prod","status":"pending"}' | jq

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
