"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
// backend/src/routes/users.ts
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const router = express_1.default.Router();
// Middleware to authenticate token (for protected routes)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'mySecretKey123!', (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
// Register a new user
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, tenant_name } = req.body;
    try {
        if (!email || !password || !tenant_name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const existingUser = yield db_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield db_1.default.query('INSERT INTO users (email, password, tenant_name, storage_used, storage_limit) VALUES ($1, $2, $3, $4, $5) RETURNING id', [email, hashedPassword, tenant_name, 0, 1000000000]);
        yield db_1.default.query('INSERT INTO workspaces (name, owner_id) VALUES ($1, $2)', [tenant_name, newUser.rows[0].id]);
        const token = jsonwebtoken_1.default.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET || 'mySecretKey123!', { expiresIn: '1h' });
        res.status(201).json({ token });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, twoFactorCode } = req.body;
    try {
        const userResult = yield db_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const user = userResult.rows[0];
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        if (user.two_factor_secret) {
            const verified = speakeasy_1.default.totp.verify({
                secret: user.two_factor_secret,
                encoding: 'base32',
                token: twoFactorCode,
            });
            if (!verified) {
                return res.status(400).json({ error: 'Invalid 2FA code' });
            }
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'mySecretKey123!', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/enable-2fa', exports.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    try {
        const secret = speakeasy_1.default.generateSecret({ length: 20 });
        yield db_1.default.query('UPDATE users SET two_factor_secret = $1 WHERE id = $2', [secret.base32, userId]);
        res.json({ secret: secret.base32 });
    }
    catch (error) {
        console.error('Error enabling 2FA:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
