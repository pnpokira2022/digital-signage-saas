"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var users_1 = __importDefault(require("./routes/users"));
var app = (0, express_1.default)();
app.use(function (req, res, next) {
    console.log("".concat(new Date().toISOString(), " - ").concat(req.method, " ").concat(req.url, " - Body: ").concat(JSON.stringify(req.body)));
    next();
});
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ strict: false }));
app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        console.error('JSON parsing error:', err.message);
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next();
});
try {
    app.use('/api/users', users_1.default);
    console.log('User routes mounted successfully');
    app.get('/health', function (req, res) { return res.json({ status: 'OK' }); });
    app.get('/debug', function (req, res) { return res.json({ message: 'Debug route working' }); });
    app.listen(3001, function () { return console.log('Server running on port 3001'); });
}
catch (error) {
    console.error('Error during server setup:', error);
    process.exit(1);
}
