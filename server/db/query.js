import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_URI,
});

/**
 * Executes a SQL query using the PostgreSQL connection pool.
 *
 * @param {string} queryString - The SQL query string to execute.
 * @param {Array} params - An array of parameters to be used in the query (optional).
 * @returns {Promise} A promise that resolves to the query result.
 */
export default function query(queryString, params) {
  return pool.query(queryString, params);
}

// when db does not have user with this id
// const res = await pool.query('SELECT * FROM users WHERE id = 2');
// res.rowCount === 0;
// res.rows === [];

// const res = await pool.query('SELECT * FROM users WHERE id = 1');
// res.rowCount === 1;
// res.rows = [
//   {
//     id: 1,
//     username: 'heybran',
//     password: '123',
//     avatarurl: null,
//     subscription: 'free',
//     twofactorauth: false,
//     tempsecret: null,
//     finalsecret: null,
//     created_at: 2023-07-07T04:44:22.287Z
//   }
// ],
