const db = require('../config/database');

const Auditoria = {
  async registrar({ accion, detalle, idAgente, idTarea }) {
    await db.query(
      `INSERT INTO Historial_auditoria (accion_realizada, detalle_ejecucion, fecha_ejecucion, Agentes_id_agente, Tareas_id_tarea)
       VALUES (?, ?, NOW(), ?, ?)`,
      [accion, detalle, idAgente, idTarea]
    );
  },
  async getByAgente(idAgente) {
    const [rows] = await db.query(
      'SELECT * FROM Historial_auditoria WHERE Agentes_id_agente = ? ORDER BY id_auditoria DESC LIMIT 20',
      [idAgente]
    );
    return rows;
  }
};

module.exports = Auditoria;
