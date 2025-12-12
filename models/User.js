import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const User = {
  // Create new user (May Validation na Dito)
  async create(userData) {
    const { username, email, password, role = 'customer' } = userData;

    // --- 👇 VALIDATION START 👇 ---
    // 1. Email Format Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }

    // 2. Password Strength Check (8 chars, 1 upper, 1 lower, 1 number)
    // Pwede mong luwagan ito kung gusto mo, pero eto ang standard strong password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number.");
    }
    // --- 👆 VALIDATION END 👆 ---

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO UserDb (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );
    return result.insertId;
  },

  // Find user by email (Walang binago)
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM UserDb WHERE email = ?', [email]);
    return rows[0];
  },

  // Find user by ID (Walang binago)
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM UserDb WHERE id = ?', [id]);
    return rows[0];
  },

  // Find user by reset token (Walang binago)
  async findByResetToken(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const [rows] = await db.query(
      'SELECT * FROM UserDb WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()',
      [hashedToken]
    );
    return rows[0];
  },

  // Update user reset token (Walang binago)
  async updateResetToken(userId, token, expires) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    await db.query(
      'UPDATE UserDb SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
      [hashedToken, expires, userId]
    );
  },

  // Update password (May Validation na Dito)
  async updatePassword(userId, password) {
    // --- 👇 VALIDATION START 👇 ---
    // Check din natin ang password strength kapag nagre-reset o nagpapalit ng password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number.");
    }
    // --- 👆 VALIDATION END 👆 ---

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'UPDATE UserDb SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
      [hashedPassword, userId]
    );
  },

  // Check if email or username exists (Walang binago)
  async checkDuplicate(email, username) {
    const [rows] = await db.query(
      'SELECT * FROM UserDb WHERE email = ? OR username = ?',
      [email, username]
    );
    return rows.length > 0;
  }
};

export default User;