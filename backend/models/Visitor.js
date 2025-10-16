const { getConnection } = require('../config/database');

class Visitor {
  static async create(visitorData) {
    const pool = getConnection();
    const {
      name,
      company,
      department,
      purpose,
      phone,
      email,
      host,
      location,
      appointmentWith,
      appointmentTime,
      hasElectronicDevices,
      electronicDevicesList,
      idType,
      idNumber,
      location,
      appointmentWith,
      appointmentTime,
      hasElectronicDevices,
      electronicDevicesList,
      idType,
      idNumber,
      checkInTime = new Date()
    } = visitorData;

    const query = `
      INSERT INTO visitors (name, company, department, purpose, phone, email, host, location, appointment_with, appointment_time, has_electronic_devices, electronic_devices_list, id_type, id_number, check_in_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'checked-in')
    `;

    const [result] = await pool.execute(query, [
      name, company, department, purpose, phone, email, host, 
      location || null, appointmentWith || null, appointmentTime || null,
    ]
    )
    try {
      const [result] = await pool.execute(query, [
        name, company, department, purpose, phone, email, host, 
        location || null, appointmentWith || null, appointmentTime || null,
        hasElectronicDevices || false, electronicDevicesList || null,
        idType || null, idNumber || null, checkInTime
      ]);

      return {
        id: result.insertId,
        ...visitorData,
        checkInTime,
        status: 'checked-in'
      };
    } catch (error) {
      console.error('Error creating visitor:', error);
      throw error;
    }
  }

  static async findAll() {
    const pool = getConnection();
    const query = `
      SELECT 
        id,
        name,
        company,
        department,
        purpose,
    const pool = getConnection();
    const query = `
      SELECT 
        id,
        name,
        company,
        department,
        purpose,
        phone,
        email,
        host,
        location,
        appointment_with as appointmentWith,
        appointment_time as appointmentTime,
        has_electronic_devices as hasElectronicDevices,
        electronic_devices_list as electronicDevicesList,
        id_type as idType,
        id_number as idNumber,
        id_verified as idVerified,
        check_in_time as checkInTime,
        check_out_time as checkOutTime,
        status,
        created_at as createdAt
      FROM visitors 
      ORDER BY check_in_time DESC
    `;

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      console.error('Error fetching visitors:', error);
      throw error;
    }
  }

  static async findById(id) {
    const pool = getConnection();
    const query = `
      SELECT 
        id,
        name,
        company,
        department,
        purpose,
    const pool = getConnection();
    const query = `
      SELECT 
        id,
        name,
        company,
        department,
        purpose,
        phone,
        email,
        host,
        location,
        appointment_with as appointmentWith,
        appointment_time as appointmentTime,
        has_electronic_devices as hasElectronicDevices,
        electronic_devices_list as electronicDevicesList,
        id_type as idType,
        id_number as idNumber,
        id_verified as idVerified,
        check_in_time as checkInTime,
        check_out_time as checkOutTime,
        status,
        created_at as createdAt
      FROM visitors 
      WHERE id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching visitor by ID:', error);
      throw error;
    }
  }

  static async checkOut(id) {
    const pool = getConnection();
    const checkOutTime = new Date();
    
    const query = `
      UPDATE visitors 
      SET check_out_time = ?, status = 'checked-out' 
      WHERE id = ?
    `;

    try {
      await pool.execute(query, [checkOutTime, id]);
      return this.findById(id);
    } catch (error) {
      console.error('Error checking out visitor:', error);
      throw error;
    }
  }

  static async delete(id) {
    const pool = getConnection();
    const query = 'DELETE FROM visitors WHERE id = ?';
    
    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting visitor:', error);
      throw error;
    }
  }

  static async getStats() {
    const pool = getConnection();
    
    try {
      // Get total visitors
      const [totalResult] = await pool.execute('SELECT COUNT(*) as count FROM visitors');
      const totalVisitors = totalResult[0].count;

      // Get currently in office
      const [currentResult] = await pool.execute(
        "SELECT COUNT(*) as count FROM visitors WHERE status = 'checked-in'"
      );
      const currentlyInOffice = currentResult[0].count;

      // Get today's stats
      const today = new Date().toISOString().split('T')[0];
      const [todayResult] = await pool.execute(
        'SELECT COUNT(*) as count FROM visitors WHERE DATE(check_in_time) = ?',
        [today]
      );
      const totalToday = todayResult[0].count;

      const [checkedOutTodayResult] = await pool.execute(
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
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
}

module.exports = Visitor;