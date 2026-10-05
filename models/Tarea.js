const db = require('../config/database');

const Tarea = {
  async getByAgente(idAgente) {
    const [rows] = await db.query('SELECT * FROM Tareas WHERE Agentes_id_agente = ? ORDER BY id_tarea DESC', [idAgente]);
    return rows;
  },
  async create({ descripcion, prioridad, requiereAprobacion, idAgente }) {
    const [result] = await db.query(
      `INSERT INTO Tareas (descripcion_solicitud, prioridad, requiere_aprobacion, fecha_creacion, Agentes_id_agente)
       VALUES (?, ?, ?, NOW(), ?)`,
      [descripcion, prioridad, requiereAprobacion, idAgente]
    );
    return result.insertId;
  }
};

module.exports = Tarea;
