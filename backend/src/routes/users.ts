// backend/src/routes/users.ts
import express, { Request, Response, NextFunction } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

const router = express.Router();

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

// Middleware to authenticate token (for protected routes)
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'mySecretKey123!', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, tenant_name } = req.body;

  try {
    if (!email || !password || !tenant_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (email, password, tenant_name, storage_used, storage_limit) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, hashedPassword, tenant_name, 0, 1000000000]
    );

    await pool.query(
      'INSERT INTO workspaces (name, owner_id) VALUES ($1, $2)',
      [tenant_name, newUser.rows[0].id]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET || 'mySecretKey123!', { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password, twoFactorCode } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (user.two_factor_secret) {
      const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: twoFactorCode,
      });
      if (!verified) {
        return res.status(400).json({ error: 'Invalid 2FA code' });
      }
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'mySecretKey123!', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/enable-2fa', authenticateToken, async (req: Request, res: Response) => {
  const { userId } = req.user!;
  try {
    const secret = speakeasy.generateSecret({ length: 20 });
    await pool.query('UPDATE users SET two_factor_secret = $1 WHERE id = $2', [secret.base32, userId]);
    res.json({ secret: secret.base32 });
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;