const db = require('../database/MySQL.database');

class MovementRequest {
  static async getAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    let query = `
      SELECT mr.*, i.name as itemName 
      FROM movement_requests mr
      JOIN items i ON mr.item_id = i.id
    `;
    const params = [];

    if (search) {
      query += ' WHERE i.name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getCount(search = '') {
    let query = `
      SELECT COUNT(*) as count 
      FROM movement_requests mr
      JOIN items i ON mr.item_id = i.id
    `;
    const params = [];

    if (search) {
      query += ' WHERE i.name LIKE ?';
      params.push(`%${search}%`);
    }

    const [result] = await db.query(query, params);
    return result[0].count;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT mr.*, i.name as itemName, u.username as requestedBy
      FROM movement_requests mr
      JOIN items i ON mr.item_id = i.id
      JOIN users u ON mr.user_id = u.id
      WHERE mr.id = ?
    `, [id]);
    return rows[0];
  }

  static async create(requestData) {
    const { itemId, userId, fromLocation, toLocation, quantity, moveTime } = requestData;
    const [result] = await db.query(
      'INSERT INTO movement_requests (item_id, user_id, from_location, to_location, quantity, move_time, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
      [itemId, userId, fromLocation, toLocation, quantity, moveTime]
    );
    return result.insertId;
  }

  static async update(id, status) {
    await db.query('UPDATE movement_requests SET status = ? WHERE id = ?', [status, id]);
  }

  static async getPendingCount() {
    try {
      const query = 'SELECT COUNT(*) as count FROM movement_requests WHERE status = ?';
      const values = ['pending'];

      console.log('Executing getPendingCount query:', query, values);
      const [result] = await db.query(query, values);
      console.log('getPendingCount query result:', result);

      return result[0].count || 0;
    } catch (error) {
      console.error('Error in getPendingCount method:', error);
      throw error;
    }
  }
}

module.exports = MovementRequest;