import { Pool } from "pg";

const pool = new Pool({
  host: "postgres",
  user: "postgres",
  database: "test_database", 
  password: "postgrespw", 
  port: 5432
});

const getUsers = (request: any, response: any) => {
  pool.query('SELECT * FROM test_table ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {getUsers}