# ForgeAI — Node.js + Express + MVC + MySQL

## Puesta en marcha
1. `npm install`
2. Copia `.env.example` a `.env` y pon tu contraseña de MySQL.
3. Ejecuta `database/schema.sql` en MySQL Workbench (crea la BD `forge_ai` y datos iniciales).
4. `npm start` y abre http://localhost:3000

## Estructura
- `app.js` · `config/database.js` · `routes/` · `controllers/` · `models/` · `views/` (EJS) · `public/` · `middlewares/` · `database/`

## Funcionalidad
Landing, registro/login (bcrypt + sesiones), CRUD de agentes (con modelo de IA y herramientas), tareas por agente e historial de auditoría.
