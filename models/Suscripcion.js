const db = require('../config/database');

const Suscripcion = {
  async crearPlanGratis(idUsuario) {
    const [[plan]] = await db.query("SELECT id_plan, duracion_meses FROM Planes WHERE nombre = 'Gratis' LIMIT 1");
    if (!plan) return;
    await db.query(
      `INSERT INTO Suscripciones (fecha_inicio, fecha_fin, estado, Usuarios_id_usuario, Planes_id_plan)
       VALUES (NOW(), DATE_ADD(NOW(), INTERVAL ? MONTH), 'activa', ?, ?)`,
      [plan.duracion_meses, idUsuario, plan.id_plan]
    );
  },
  async limiteAgentes(idUsuario) {
    const [rows] = await db.query(
      `SELECT p.limite_agentes FROM Suscripciones s JOIN Planes p ON p.id_plan = s.Planes_id_plan
       WHERE s.Usuarios_id_usuario = ? AND s.estado = 'activa' ORDER BY s.id_suscripcion DESC LIMIT 1`,
      [idUsuario]
    );
    return rows[0] ? rows[0].limite_agentes : 3;
  }
};

module.exports = Suscripcion;
