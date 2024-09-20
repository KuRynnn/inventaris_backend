const mysql = require('mysql2/promise');

class MySQLDatabase {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      console.log('Successfully connected to the database');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  async query(sql, values) {
    if (!this.connection) {
      await this.connect();
    }
    try {
      console.log('Executing query:', sql, 'with values:', values);
      const [rows, fields] = await this.connection.execute(sql, values);
      console.log('Query executed successfully, returned rows:', rows.length);
      return [rows, fields];
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}

module.exports = new MySQLDatabase();