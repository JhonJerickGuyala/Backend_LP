import db from '../config/db.js';

const ReservationModel = {
  
  async create(reservationData) {
    const {
      transaction_id,
      amenity_name,
      quantity,
      price,
      check_in_date,
      check_out_date
    } = reservationData;

    const [result] = await db.query(
      `INSERT INTO ReservationDb (
        transaction_id, amenity_name, quantity, price,
        check_in_date, check_out_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [transaction_id, amenity_name, quantity, price, check_in_date, check_out_date]
    );
    return result.insertId;
  },

  

  
  async findByTransactionId(transaction_id) {
    const [rows] = await db.query(
      'SELECT * FROM ReservationDb WHERE transaction_id = ?',
      [transaction_id]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM ReservationDb WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  
  async updateStatusByTransaction(transaction_id, status) {
    await db.query(
      'UPDATE ReservationDb SET status = ? WHERE transaction_id = ?',
      [status, transaction_id]
    );
  },

  
  async cancelByTransaction(transaction_id) {
    await db.query(
      'UPDATE ReservationDb SET status = "Cancelled" WHERE transaction_id = ?',
      [transaction_id]
    );
  },

  
  async createMultiple(reservationsData) {
    const promises = reservationsData.map(reservation => this.create(reservation));
    return Promise.all(promises);
  }
};

export default ReservationModel;