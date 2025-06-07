"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/db.ts
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB || 'digital_signage',
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'admin123',
});
exports.default = pool;
