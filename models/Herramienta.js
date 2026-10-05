const db = require('../config/database');

module.exports = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM Herramientas ORDER BY nombre');
    return rows;
  }
};
