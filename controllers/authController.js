const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Suscripcion = require('../models/Suscripcion');

exports.showRegister = (req, res) => res.render('auth/registro', { title: 'Crear cuenta', error: null, form: {} });

exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    const form = { nombre, email };
    if (!nombre || !email || !password || password.length < 6) {
      return res.render('auth/registro', { title: 'Crear cuenta', error: 'Completa todos los campos (contraseña de al menos 6 caracteres).', form });
    }
    if (await Usuario.findByEmail(email)) {
      return res.render('auth/registro', { title: 'Crear cuenta', error: 'Ese correo ya está registrado.', form });
    }
    const hash = await bcrypt.hash(password, 10);
    const id = await Usuario.create(nombre.trim(), email.trim().toLowerCase(), hash);
    await Suscripcion.crearPlanGratis(id);
    req.session.user = { id, nombre: nombre.trim() };
    res.redirect('/agentes');
  } catch (err) { next(err); }
};

exports.showLogin = (req, res) => res.render('auth/login', { title: 'Iniciar sesión', error: null });

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const usuario = email ? await Usuario.findByEmail(email.trim().toLowerCase()) : null;
    if (!usuario || !(await bcrypt.compare(password || '', usuario.password_hash))) {
      return res.render('auth/login', { title: 'Iniciar sesión', error: 'Correo o contraseña incorrectos.' });
    }
    req.session.user = { id: usuario.id_usuario, nombre: usuario.nombre };
    res.redirect('/agentes');
  } catch (err) { next(err); }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
