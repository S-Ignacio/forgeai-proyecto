const db = require('../config/database');

module.exports = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM Modelos_ia ORDER BY nombre_modelo');
    return rows;
  }
};
