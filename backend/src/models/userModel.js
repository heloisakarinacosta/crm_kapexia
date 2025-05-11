const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

const User = {
  async findByUsername(username) {
    const [rows] = await pool.execute(
      "SELECT * FROM administrators WHERE username = ?",
      [username]
    );
    return rows[0];
  },

  async createUser(username, password, email) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await pool.execute(
      "INSERT INTO administrators (username, password_hash, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email]
    );
    return { id: result.insertId, username, email };
  },

  // Method to compare password (useful for login)
  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
};

module.exports = User;

