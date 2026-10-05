const Agente = require('../models/Agente');
const Modelo = require('../models/Modelo');
const Herramienta = require('../models/Herramienta');
const Tarea = require('../models/Tarea');
const Auditoria = require('../models/Auditoria');
const Suscripcion = require('../models/Suscripcion');

const toArray = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

exports.index = async (req, res, next) => {
  try {
    const agentes = await Agente.getAllByUser(req.session.user.id);
    res.render('agentes/index', { title: 'Mis agentes', agentes });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const [modelos, herramientas] = await Promise.all([Modelo.getAll(), Herramienta.getAll()]);
    res.render('agentes/form', {
      title: 'Nuevo agente', agente: {}, modelos, herramientas, seleccionadas: [], error: null, action: '/agentes', edit: false
    });
  } catch (err) { next(err); }
};

exports.store = async (req, res, next) => {
  try {
    const { nombre, descripcion, estado, idModelo } = req.body;
    const idUsuario = req.session.user.id;
    if (!nombre || !descripcion || !idModelo) {
      const [modelos, herramientas] = await Promise.all([Modelo.getAll(), Herramienta.getAll()]);
      return res.render('agentes/form', {
        title: 'Nuevo agente', agente: req.body, modelos, herramientas, seleccionadas: toArray(req.body.herramientas).map(Number),
        error: 'Nombre, descripción y modelo son obligatorios.', action: '/agentes', edit: false
      });
    }
    const [total, limite] = await Promise.all([Agente.countByUser(idUsuario), Suscripcion.limiteAgentes(idUsuario)]);
    if (total >= limite) {
      const [modelos, herramientas] = await Promise.all([Modelo.getAll(), Herramienta.getAll()]);
      return res.render('agentes/form', {
        title: 'Nuevo agente', agente: req.body, modelos, herramientas, seleccionadas: [],
        error: `Tu plan permite hasta ${limite} agentes.`, action: '/agentes', edit: false
      });
    }
    const id = await Agente.create({
      nombre: nombre.trim(), descripcion: descripcion.trim(), estado: estado || 'activo',
      soporte_obsidian: req.body.soporte_obsidian ? 1 : 0, idUsuario, idModelo
    });
    await Agente.setHerramientas(id, toArray(req.body.herramientas));
    res.redirect('/agentes');
  } catch (err) { next(err); }
};

exports.show = async (req, res, next) => {
  try {
    const agente = await Agente.getById(req.params.id, req.session.user.id);
    if (!agente) return res.status(404).render('404', { title: 'No encontrado' });
    const [herramientas, tareas, auditoria] = await Promise.all([
      Agente.getHerramientas(agente.id_agente), Tarea.getByAgente(agente.id_agente), Auditoria.getByAgente(agente.id_agente)
    ]);
    res.render('agentes/show', { title: agente.nombre, agente, herramientas, tareas, auditoria });
  } catch (err) { next(err); }
};

exports.edit = async (req, res, next) => {
  try {
    const agente = await Agente.getById(req.params.id, req.session.user.id);
    if (!agente) return res.status(404).render('404', { title: 'No encontrado' });
    const [modelos, herramientas, actuales] = await Promise.all([
      Modelo.getAll(), Herramienta.getAll(), Agente.getHerramientas(agente.id_agente)
    ]);
    res.render('agentes/form', {
      title: 'Editar agente', agente: { ...agente, idModelo: agente.Modelos_ia_id_modelo }, modelos, herramientas,
      seleccionadas: actuales.map((h) => h.id_herramienta), error: null, action: `/agentes/${agente.id_agente}`, edit: true
    });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { nombre, descripcion, estado, idModelo } = req.body;
    if (!nombre || !descripcion || !idModelo) return res.redirect(`/agentes/${req.params.id}/editar`);
    const filas = await Agente.update(req.params.id, req.session.user.id, {
      nombre: nombre.trim(), descripcion: descripcion.trim(), estado: estado || 'activo',
      soporte_obsidian: req.body.soporte_obsidian ? 1 : 0, idModelo
    });
    if (filas) await Agente.setHerramientas(req.params.id, toArray(req.body.herramientas));
    res.redirect('/agentes');
  } catch (err) { next(err); }
};

exports.destroy = async (req, res, next) => {
  try {
    await Agente.delete(req.params.id, req.session.user.id);
    res.redirect('/agentes');
  } catch (err) { next(err); }
};

exports.storeTarea = async (req, res, next) => {
  try {
    const agente = await Agente.getById(req.params.id, req.session.user.id);
    if (!agente) return res.status(404).render('404', { title: 'No encontrado' });
    const { descripcion, prioridad } = req.body;
    if (descripcion && descripcion.trim()) {
      const idTarea = await Tarea.create({
        descripcion: descripcion.trim(), prioridad: prioridad || 'media',
        requiereAprobacion: req.body.requiere_aprobacion ? 1 : 0, idAgente: agente.id_agente
      });
      await Auditoria.registrar({
        accion: 'Tarea creada', detalle: `Solicitud registrada con prioridad ${prioridad || 'media'}`,
        idAgente: agente.id_agente, idTarea
      });
    }
    res.redirect(`/agentes/${agente.id_agente}`);
  } catch (err) { next(err); }
};
