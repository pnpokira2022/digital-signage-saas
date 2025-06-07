// backend/src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/users';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`);
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ strict: false }));
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err.message);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next();
});

try {
  app.use('/api/users', userRoutes);
  console.log('User routes mounted successfully');

  app.get('/health', (req: Request, res: Response) => res.json({ status: 'OK' }));
  app.get('/debug', (req: Request, res: Response) => res.json({ message: 'Debug route working' }));

  app.listen(3001, () => console.log('Server running on port 3001'));
} catch (error) {
  console.error('Error during server setup:', error);
  process.exit(1);
}