"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`);
    next();
});
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ strict: false }));
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        console.error('JSON parsing error:', err.message);
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next();
});
try {
    app.use('/api/users', users_1.default);
    console.log('User routes mounted successfully');
    app.get('/health', (req, res) => res.json({ status: 'OK' }));
    app.get('/debug', (req, res) => res.json({ message: 'Debug route working' }));
    app.listen(3001, () => console.log('Server running on port 3001'));
}
catch (error) {
    console.error('Error during server setup:', error);
    process.exit(1);
}
