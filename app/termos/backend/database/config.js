import mysql from 'mysql2/promise';

export default class {
  
  #connection = null;

  constructor() {
  
    this.#connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      timezone: process.env.DB_TIMEZONE,
      namedPlaceholders: true,
      connectTimeout: 3000,
    });
  
  }

  get connection() {
    return this.#connection
  }
  
}
