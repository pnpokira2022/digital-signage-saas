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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
// backend/src/routes/users.ts
var express_1 = __importDefault(require("express"));
var db_1 = __importDefault(require("../db"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var speakeasy_1 = __importDefault(require("speakeasy"));
var router = express_1.default.Router();
// Middleware to authenticate token (for protected routes)
var authenticateToken = function (req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'mySecretKey123!', function (err, user) {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
// Register a new user
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, tenant_name, existingUser, hashedPassword, newUser, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, tenant_name = _a.tenant_name;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                if (!email || !password || !tenant_name) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing required fields' })];
                }
                return [4 /*yield*/, db_1.default.query('SELECT * FROM users WHERE email = $1', [email])];
            case 2:
                existingUser = _b.sent();
                if (existingUser.rows.length > 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'Email already exists' })];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 3:
                hashedPassword = _b.sent();
                return [4 /*yield*/, db_1.default.query('INSERT INTO users (email, password, tenant_name, storage_used, storage_limit) VALUES ($1, $2, $3, $4, $5) RETURNING id', [email, hashedPassword, tenant_name, 0, 1000000000])];
            case 4:
                newUser = _b.sent();
                return [4 /*yield*/, db_1.default.query('INSERT INTO workspaces (name, owner_id) VALUES ($1, $2)', [tenant_name, newUser.rows[0].id])];
            case 5:
                _b.sent();
                token = jsonwebtoken_1.default.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET || 'mySecretKey123!', { expiresIn: '1h' });
                res.status(201).json({ token: token });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error('Error during registration:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, twoFactorCode, userResult, user, validPassword, verified, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, twoFactorCode = _a.twoFactorCode;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.default.query('SELECT * FROM users WHERE email = $1', [email])];
            case 2:
                userResult = _b.sent();
                if (userResult.rows.length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid email or password' })];
                }
                user = userResult.rows[0];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                validPassword = _b.sent();
                if (!validPassword) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid email or password' })];
                }
                if (user.two_factor_secret) {
                    verified = speakeasy_1.default.totp.verify({
                        secret: user.two_factor_secret,
                        encoding: 'base32',
                        token: twoFactorCode,
                    });
                    if (!verified) {
                        return [2 /*return*/, res.status(400).json({ error: 'Invalid 2FA code' })];
                    }
                }
                token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'mySecretKey123!', { expiresIn: '1h' });
                res.json({ token: token });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error('Error during login:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/enable-2fa', exports.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, secret, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                secret = speakeasy_1.default.generateSecret({ length: 20 });
                return [4 /*yield*/, db_1.default.query('UPDATE users SET two_factor_secret = $1 WHERE id = $2', [secret.base32, userId])];
            case 2:
                _a.sent();
                res.json({ secret: secret.base32 });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error enabling 2FA:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
