const db = require('../config/database');

const Usuario = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
    return rows[0];
  },
  async create(nombre, email, passwordHash) {
    const [result] = await db.query(
      'INSERT INTO Usuarios (nombre, email, password_hash, fecha_registro) VALUES (?, ?, ?, NOW())',
      [nombre, email, passwordHash]
    );
    return result.insertId;
  }
};

module.exports = Usuario;
