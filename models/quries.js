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
  const { rows } = await pool.query("SELECT * FROM users WHERE id=$1", [id]);

  const user = rows[0];

  return user;
}

module.exports = {
  validateUser,
  getUser,
};
