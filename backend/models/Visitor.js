const { getConnection } = require('../config/database');

class Visitor {
  static async create(visitorData) {
    const connection = getConnection();
    const {
      name,
      company,
      purpose,
      phone,
      email,
      host,
      checkInTime = new Date()
    } = visitorData;

    const query = `
      INSERT INTO visitors (name, company, purpose, phone, email, host, check_in_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'checked-in')
    `;

    const [result] = await connection.execute(query, [
      name, company, purpose, phone, email, host, checkInTime
    ]);

    return {
      id: result.insertId,
      ...visitorData,
      checkInTime,
      status: 'checked-in'
    };
  }

  static async findAll() {
    const connection = getConnection();
    const query = `
      SELECT 
        id,
        name,
        company,
        purpose,
        phone,
        email,
        host,
        check_in_time as checkInTime,
        check_out_time as checkOutTime,
        status,
        created_at as createdAt
      FROM visitors 
      ORDER BY check_in_time DESC
    `;

    const [rows] = await connection.execute(query);
    return rows;
  }

  static async findById(id) {
    const connection = getConnection();
    const query = `
      SELECT 
        id,
        name,
        company,
        purpose,
        phone,
        email,
        host,
        check_in_time as checkInTime,
        check_out_time as checkOutTime,
        status,
        created_at as createdAt
      FROM visitors 
      WHERE id = ?
    `;

    const [rows] = await connection.execute(query, [id]);
    return rows[0];
  }

  static async checkOut(id) {
    const connection = getConnection();
    const checkOutTime = new Date();
    
    const query = `
      UPDATE visitors 
      SET check_out_time = ?, status = 'checked-out' 
      WHERE id = ?
    `;

    await connection.execute(query, [checkOutTime, id]);
    return this.findById(id);
  }

  static async delete(id) {
    const connection = getConnection();
    const query = 'DELETE FROM visitors WHERE id = ?';
    const [result] = await connection.execute(query, [id]);
    return result.affectedRows > 0;
  }

  static async getStats() {
    const connection = getConnection();
    
    // Get total visitors
    const [totalResult] = await connection.execute('SELECT COUNT(*) as count FROM visitors');
    const totalVisitors = totalResult[0].count;

    // Get currently in office
    const [currentResult] = await connection.execute(
      "SELECT COUNT(*) as count FROM visitors WHERE status = 'checked-in'"
    );
    const currentlyInOffice = currentResult[0].count;

    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    const [todayResult] = await connection.execute(
      'SELECT COUNT(*) as count FROM visitors WHERE DATE(check_in_time) = ?',
      [today]
    );
    const totalToday = todayResult[0].count;

    const [checkedOutTodayResult] = await connection.execute(
      "SELECT COUNT(*) as count FROM visitors WHERE DATE(check_in_time) = ? AND status = 'checked-out'",
      [today]
    );
    const checkedOutToday = checkedOutTodayResult[0].count;

    return {
      totalVisitors,
      currentlyInOffice,
      totalToday,
      checkedOutToday
    };
  }
}

module.exports = Visitor;