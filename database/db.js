import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1996',
  database: 'db_crudFatec',
});

export default connection