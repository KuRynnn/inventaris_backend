const db = require('../database/MySQL.database');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, password, role) {
    try {
      const hashedPassword = await bcrypt.hash(password, 8);
      const result = await db.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      console.log('Searching for user:', username);
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username.trim()]);
      console.log('Query result:', rows);
      
      // Check if rows is an array or an object
      if (Array.isArray(rows)) {
        if (rows.length > 0) {
          console.log('User found (array):', rows[0]);
          return rows[0];
        }
      } else if (rows && typeof rows === 'object') {
        console.log('User found (object):', rows);
        return rows;
      }
      
      console.log('No user found with username:', username);
      return null;
    } catch (error) {
      console.error('Error in findByUsername:', error);
      throw error;
    }
  }

  static async comparePassword(inputPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
      console.log('Password comparison result:', isMatch);
      return isMatch;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw error;
    }
  }
}

module.exports = User;