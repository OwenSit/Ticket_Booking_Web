// CREATE TABLE todo(
//   todo_id SERIAL PRIMARY KEY,
//   description VARCHAR(255)
// );
// only two attributes in the table: todo_id and description
const data = require("./password.json");
const Pool = require("pg").Pool;
var username, password;
username = data.name;
password = data.password;

const pool = new Pool({
  host: "code.cs.uh.edu",
  user: username,
  password: password,
  port: 5432,
  database: "COSC3380",
});

module.exports = pool;
