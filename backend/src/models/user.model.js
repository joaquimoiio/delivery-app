// src/models/user.model.js
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, address, user_type, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  async create(userData) {
    const { name, email, password, phone, address, user_type } = userData;
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone, address, user_type) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address, user_type]
    );
    
    return result.insertId;
  }

  async update(id, userData) {
    const { name, phone, address } = userData;
    
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, id]
    );
    
    return result.affectedRows > 0;
  }

  async updatePassword(id, password) {
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = new UserModel();

// src/models/store.model.js
const { pool } = require('../config/database');

class StoreModel {
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM stores WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  async findByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM stores WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  async findAll(filters = {}) {
    let query = 'SELECT * FROM stores WHERE is_open = 1';
    const params = [];
    
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    
    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    
    query += ' ORDER BY name ASC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  async create(storeData) {
    const { 
      user_id, name, description, logo_url, category, 
      address, delivery_fee, avg_delivery_time 
    } = storeData;
    
    const [result] = await pool.execute(
      `INSERT INTO stores 
       (user_id, name, description, logo_url, category, address, delivery_fee, avg_delivery_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, description, logo_url, category, address, delivery_fee, avg_delivery_time]
    );
    
    return result.insertId;
  }

  async update(id, storeData) {
    const { 
      name, description, logo_url, category, 
      address, delivery_fee, avg_delivery_time, is_open 
    } = storeData;
    
    const [result] = await pool.execute(
      `UPDATE stores SET 
       name = ?, description = ?, logo_url = ?, category = ?, 
       address = ?, delivery_fee = ?, avg_delivery_time = ?, is_open = ?
       WHERE id = ?`,
      [name, description, logo_url, category, address, delivery_fee, avg_delivery_time, is_open, id]
    );
    
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM stores WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  async getStoreRating(storeId) {
    const [rows] = await pool.execute(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
       FROM store_reviews 
       WHERE store_id = ?`,
      [storeId]
    );
    
    return rows[0];
  }
}

module.exports = new StoreModel();

// src/models/product.model.js
const { pool } = require('../config/database');

class ProductModel {
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  async findByStoreId(storeId, categoryId = null) {
    let query = 'SELECT * FROM products WHERE store_id = ?';
    const params = [storeId];
    
    if (categoryId) {
      query += ' AND category_id = ?';
      params.push(categoryId);
    }
    
    query += ' ORDER BY name ASC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  async create(productData) {
    const { 
      store_id, category_id, name, description, 
      price, image_url, is_available 
    } = productData;
    
    const [result] = await pool.execute(
      `INSERT INTO products 
       (store_id, category_id, name, description, price, image_url, is_available) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [store_id, category_id, name, description, price, image_url, is_available]
    );
    
    return result.insertId;
  }

  async update(id, productData) {
    const { 
      category_id, name, description, 
      price, image_url, is_available 
    } = productData;
    
    const [result] = await pool.execute(
      `UPDATE products SET 
       category_id = ?, name = ?, description = ?, 
       price = ?, image_url = ?, is_available = ?
       WHERE id = ?`,
      [category_id, name, description, price, image_url, is_available, id]
    );
    
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  async getCategories(storeId) {
    const [rows] = await pool.execute(
      'SELECT * FROM product_categories WHERE store_id = ? ORDER BY name ASC',
      [storeId]
    );
    return rows;
  }

  async createCategory(storeId, name) {
    const [result] = await pool.execute(
      'INSERT INTO product_categories (store_id, name) VALUES (?, ?)',
      [storeId, name]
    );
    
    return result.insertId;
  }

  async updateCategory(id, name) {
    const [result] = await pool.execute(
      'UPDATE product_categories SET name = ? WHERE id = ?',
      [name, id]
    );
    
    return result.affectedRows > 0;
  }

  async deleteCategory(id) {
    const [result] = await pool.execute(
      'DELETE FROM product_categories WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = new ProductModel();

// src/models/order.model.js
const { pool } = require('../config/database');

class OrderModel {
  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT o.*, u.name as user_name, u.phone as user_phone, s.name as store_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN stores s ON o.store_id = s.id
       WHERE o.id = ?`,
      [id]
    );
    return rows[0];
  }

  async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT o.*, s.name as store_name
       FROM orders o
       JOIN stores s ON o.store_id = s.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return rows;
  }

  async findByStoreId(storeId, status = null) {
    let query = `SELECT o.*, u.name as user_name, u.phone as user_phone
                FROM orders o
                JOIN users u ON o.user_id = u.id
                WHERE o.store_id = ?`;
    const params = [storeId];
    
    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY o.created_at DESC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  async create(orderData) {
    const { 
      user_id, store_id, total_amount, delivery_fee, 
      payment_method, delivery_address, notes 
    } = orderData;
    
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Criar pedido
      const [orderResult] = await connection.execute(
        `INSERT INTO orders 
         (user_id, store_id, total_amount, delivery_fee, payment_method, delivery_address, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, store_id, total_amount, delivery_fee, payment_method, delivery_address, notes]
      );
      
      const orderId = orderResult.insertId;
      
      // Inserir itens do pedido
      for (const item of orderData.items) {
        await connection.execute(
          `INSERT INTO order_items 
           (order_id, product_id, quantity, unit_price, notes) 
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.unit_price, item.notes]
        );
      }
      
      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getOrderItems(orderId) {
    const [rows] = await pool.execute(
      `SELECT oi.*, p.name as product_name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  }

  async updateStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = new OrderModel();

// src/models/review.model.js
const { pool } = require('../config/database');

class ReviewModel {
  async findByStoreId(storeId) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.name as user_name 
       FROM store_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    return rows;
  }

  async create(reviewData) {
    const { user_id, store_id, order_id, rating, comment } = reviewData;
    
    const [result] = await pool.execute(
      `INSERT INTO store_reviews 
       (user_id, store_id, order_id, rating, comment) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, store_id, order_id, rating, comment]
    );
    
    return result.insertId;
  }

  async findByOrderId(orderId) {
    const [rows] = await pool.execute(
      `SELECT * FROM store_reviews WHERE order_id = ?`,
      [orderId]
    );
    return rows[0];
  }
}

module.exports = new ReviewModel();