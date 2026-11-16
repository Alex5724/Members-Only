const pool = require("./pool");
const bcrypt = require("bcrypt");

async function validateUser(name, password) {
  const { rows } = await pool.query("SELECT * FROM users WHERE name=$1", [
    name,
  ]);

  const user = rows[0];

  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);

  if (!match) return null;

  return user;
}

async function getUser(id) {
  const { rows } = await pool.query(
    `SELECT id, name FROM users WHERE id = $1;`,
    [id],
  );

  const user = rows[0];

  return user;
}

async function getContent() {
  const { rows } = await pool.query(`SELECT * FROM messages ORDER BY id DESC`);

  const posts = rows;

  return posts;
}

async function insertUser(name, password) {
  await pool.query("INSERT INTO users (name, password) VALUES ($1, $2)", [
    name,
    password,
  ]);
}

async function existingUser(name) {
  const result = await pool.query(
    "SELECT id, name FROM users WHERE name = $1",
    [name],
  );

  return result.rowCount;
}

module.exports = {
  validateUser,
  getUser,
  getContent,
  insertUser,
  existingUser,
};
