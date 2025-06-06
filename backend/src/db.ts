// backend/src/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'digital_signage',
  user: 'admin',
  password: 'admin123',
});

export default pool;