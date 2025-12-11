import db from '../../config/db.js';

const CustomerFeedbackModel = {
  // GET ALL REVIEWS (Updated with Date Filtering)
  async getAll(startDate, endDate) {
    // Base query: Siguraduhin na tama ang column names
    let query = `SELECT id, customer_name, rating AS average, comment, date, rating_service AS service, rating_cleanliness AS cleanliness, rating_amenities AS amenities FROM FeedbackDb`;
    
    const params = [];

    // Date Filtering Logic (Ito ang bago sa updated code)
    if (startDate && endDate && startDate !== 'undefined' && endDate !== 'undefined') {
      // ✅ Siguraduhing 'date' ang column name (base sa database screenshot mo)
      query += ` WHERE date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    // ✅ Order by 'date' descending
    query += ` ORDER BY date DESC`;

    const [rows] = await db.query(query, params);
    return rows; 
  },

  // CREATE NEW REVIEW
  async create(data) {
    const query = `INSERT INTO FeedbackDb (customer_name, rating, comment, date, rating_service, rating_cleanliness, rating_amenities) VALUES (?, ?, ?, NOW(), ?, ?, ?)`;
    
    const finalRating = Math.round(data.rating); 

    const [result] = await db.query(query, [
      data.name, 
      finalRating, 
      data.comment,
      data.ratings.service,      
      data.ratings.cleanliness,  
      data.ratings.amenities     
    ]);
    return result;
  }
};

export default CustomerFeedbackModel;
