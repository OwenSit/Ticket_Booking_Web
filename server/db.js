// CREATE TABLE todo(
//   todo_id SERIAL PRIMARY KEY,
//   description VARCHAR(255)  
// );
// only two attributes in the table: todo_id and description
const Pool = require('pg').Pool;

const pool = new Pool({
  host: 'code.cs.uh.edu',
  user: 'cosc0213',
  password: '1787457XS',
  port: 5432,
  database: 'COSC3380'
});

module.exports = pool;