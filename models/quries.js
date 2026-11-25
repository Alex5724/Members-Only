const pool = require("./pool");
const bcrypt = require("bcrypt");

async function validateUser(email, password) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  const user = rows[0];

  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);

  if (!match) return null;

  return user;
}

async function getUser(id) {
  const { rows } = await pool.query(
    "SELECT id, first_name, last_name, email, is_admin FROM users WHERE id = $1",
    [id],
  );

  return rows[0];
}

async function getContent() {
  const { rows } = await pool.query(`SELECT * FROM messages ORDER BY id DESC`);

  const posts = rows;

  return posts;
}

async function insertUser(first_name, last_name, email, password, admin) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES ($1, $2, $3, $4, $5)",
    [first_name, last_name, email, password, admin],
  );
}

async function existingUser(email) {
  const result = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  return result.rowCount;
}

module.exports = {
  validateUser,
  getUser,
  getContent,
  insertUser,
  existingUser,
};
