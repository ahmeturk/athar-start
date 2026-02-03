/**
 * Vercel Serverless Entry Point
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', 'server', '.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check (no DB needed)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'أثر البداية API is running',
    timestamp: new Date().toISOString(),
    hasMongoUri: !!process.env.MONGODB_URI,
  });
});

// Lazy MongoDB connection
const ensureDB = async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في الاتصال بقاعدة البيانات',
        error: error.message,
      });
    }
  }
  next();
};

// Dynamically import routes to avoid top-level import errors
let routesLoaded = false;
const loadRoutes = async () => {
  if (routesLoaded) return;
  try {
    const authRoutes = (await import('../server/routes/auth.js')).default;
    const userRoutes = (await import('../server/routes/users.js')).default;
    const assessmentRoutes = (await import('../server/routes/assessment.js')).default;
    const paymentRoutes = (await import('../server/routes/payments.js')).default;
    const adminRoutes = (await import('../server/routes/admin.js')).default;

    app.use('/api/auth', ensureDB, authRoutes);
    app.use('/api/users', ensureDB, userRoutes);
    app.use('/api/assessment', ensureDB, assessmentRoutes);
    app.use('/api/payments', ensureDB, paymentRoutes);
    app.use('/api/admin', ensureDB, adminRoutes);
    routesLoaded = true;
  } catch (error) {
    console.error('Route loading error:', error);
  }
};

// Load routes immediately
loadRoutes();

// Catch-all error handler
app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'خطأ في الخادم',
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined,
  });
});

export default app;
