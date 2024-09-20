const db = require('../database/MySQL.database');

class Item {
  static async getAll(type, page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM items';
    const params = [];

    if (type || search) {
      query += ' WHERE';
      if (type) {
        query += ' type = ?';
        params.push(type);
      }
      if (search) {
        if (type) query += ' AND';
        query += ' name LIKE ?';
        params.push(`%${search}%`);
      }
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getCount(filters = {}) {
    try {
      let query = 'SELECT COUNT(*) as count FROM items WHERE 1=1';
      const values = [];

      if (filters.search) {
        query += ' AND name LIKE ?';
        values.push(`%${filters.search}%`);
      }

      console.log('Executing getCount query:', query, values);
      const [result] = await db.query(query, values);
      console.log('getCount query result:', result);

      return result[0].count || 0;
    } catch (error) {
      console.error('Error in getCount method:', error);
      throw error;
    }
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(itemData) {
    const { name, quantity, type, location } = itemData;
    const [result] = await db.query(
      'INSERT INTO items (name, quantity, type, location) VALUES (?, ?, ?, ?)',
      [name, quantity, type, location]
    );
    return result.insertId;
  }

  static async update(id, itemData) {
    const { name, quantity, type, location } = itemData;
    await db.query(
      'UPDATE items SET name = ?, quantity = ?, type = ?, location = ? WHERE id = ?',
      [name, quantity, type, location, id]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM items WHERE id = ?', [id]);
  }

  static async getStats() {
    const [rows] = await db.query(`
      SELECT 
        SUM(CASE WHEN type = 'inventory' THEN 1 ELSE 0 END) as inventoryCount,
        SUM(CASE WHEN type = 'consumable' THEN 1 ELSE 0 END) as consumableCount
      FROM items
    `);
    return rows[0];
  }
}

module.exports = Item;