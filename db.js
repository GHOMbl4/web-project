require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'manager',
      phone VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      company VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Новый',
      source VARCHAR(50),
      manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deals (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      amount NUMERIC(12,2) DEFAULT 0,
      stage VARCHAR(50) DEFAULT 'Новая',
      client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      close_date DATE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      due_date DATE,
      priority VARCHAR(20) DEFAULT 'normal',
      done BOOLEAN DEFAULT FALSE,
      client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
      manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      text TEXT,
      client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('Таблицы готовы');
}

module.exports = { pool, initDatabase };