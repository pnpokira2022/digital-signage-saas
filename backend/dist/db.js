"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/db.ts
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: 'localhost',
    port: 5432,
    database: 'digital_signage',
    user: 'admin',
    password: 'admin123',
});
exports.default = pool;
