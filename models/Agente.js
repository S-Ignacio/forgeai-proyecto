const db = require('../config/database');

const Agente = {
  async getAllByUser(idUsuario) {
    const [rows] = await db.query(
      `SELECT a.*, m.nombre_modelo
       FROM Agentes a JOIN Modelos_ia m ON m.id_modelo = a.Modelos_ia_id_modelo
       WHERE a.Usuarios_id_usuario = ? ORDER BY a.id_agente DESC`,
      [idUsuario]
    );
    return rows;
  },
  async countByUser(idUsuario) {
    const [[row]] = await db.query('SELECT COUNT(*) AS total FROM Agentes WHERE Usuarios_id_usuario = ?', [idUsuario]);
    return row.total;
  },
  async getById(id, idUsuario) {
    const [rows] = await db.query(
      `SELECT a.*, m.nombre_modelo
       FROM Agentes a JOIN Modelos_ia m ON m.id_modelo = a.Modelos_ia_id_modelo
       WHERE a.id_agente = ? AND a.Usuarios_id_usuario = ?`,
      [id, idUsuario]
    );
    return rows[0];
  },
  async create({ nombre, descripcion, estado, soporte_obsidian, idUsuario, idModelo }) {
    const [result] = await db.query(
      `INSERT INTO Agentes (nombre, descripcion, estado, soporte_obsidian, Usuarios_id_usuario, Modelos_ia_id_modelo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, estado, soporte_obsidian, idUsuario, idModelo]
    );
    return result.insertId;
  },
  async update(id, idUsuario, { nombre, descripcion, estado, soporte_obsidian, idModelo }) {
    const [result] = await db.query(
      `UPDATE Agentes SET nombre = ?, descripcion = ?, estado = ?, soporte_obsidian = ?, Modelos_ia_id_modelo = ?
       WHERE id_agente = ? AND Usuarios_id_usuario = ?`,
      [nombre, descripcion, estado, soporte_obsidian, idModelo, id, idUsuario]
    );
    return result.affectedRows;
  },
  async delete(id, idUsuario) {
    const [result] = await db.query('DELETE FROM Agentes WHERE id_agente = ? AND Usuarios_id_usuario = ?', [id, idUsuario]);
    return result.affectedRows;
  },
  async getHerramientas(idAgente) {
    const [rows] = await db.query(
      `SELECT h.*, ah.nivel_permiso FROM Agentes_herramientas ah
       JOIN Herramientas h ON h.id_herramienta = ah.Herramientas_id_herramienta
       WHERE ah.Agentes_id_agente = ?`,
      [idAgente]
    );
    return rows;
  },
  async setHerramientas(idAgente, idsHerramientas) {
    await db.query('DELETE FROM Agentes_herramientas WHERE Agentes_id_agente = ?', [idAgente]);
    for (const idH of idsHerramientas) {
      await db.query(
        `INSERT INTO Agentes_herramientas (Agentes_id_agente, Herramientas_id_herramienta, nivel_permiso)
         SELECT ?, id_herramienta, tipo_permiso FROM Herramientas WHERE id_herramienta = ?`,
        [idAgente, idH]
      );
    }
  }
};

module.exports = Agente;
