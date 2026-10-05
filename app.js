require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');

const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const agenteRoutes = require('./routes/agenteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 4 }
}));

// Usuario disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/agentes', agenteRoutes);

app.use((req, res) => res.status(404).render('404', { title: 'No encontrado' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Error interno del servidor');
});

app.listen(PORT, () => console.log(`ForgeAI funcionando en http://localhost:${PORT}`));
