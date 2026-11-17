import express from 'express';
import cors from 'cors';
import {
  handleAnalyzeFoodPhoto,
  handleCalisthenicsApi,
  handleGymApi,
  handleVaultStatus,
  handleNeonHealth,
  handleNeonSync,
  handleSendEmail,
  handleStorageUpload,
  handleCloudArchitectureStatus
} from '../server/apiHandler.js';

const app = express();

// ====================================================================
// SECURITY HEADERS & PRIVACY MIDDLEWARES (OWASP Top 10)
// ====================================================================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// ====================================================================
// VERCEL SERVERLESS API ROUTES
// ====================================================================
app.post('/api/nutrition/analyze-photo', handleAnalyzeFoodPhoto);
app.get('/api/exercises/calisthenics', handleCalisthenicsApi);
app.get('/api/exercises/gym', handleGymApi);
app.get('/api/vault/status', handleVaultStatus);

// Neon PostgreSQL Endpoints (Parameterized Queries & Strict Data Ownership)
app.get('/api/db/health', handleNeonHealth);
app.get('/api/neon/health', handleNeonHealth);
app.post('/api/db/sync', handleNeonSync);
app.post('/api/neon/profile', handleNeonSync);
app.post('/api/neon/weigh-in', handleNeonSync);
app.post('/api/neon/workout-log', handleNeonSync);
app.post('/api/neon/nutrition-log', handleNeonSync);

// Resend Transactional Email Endpoints
app.post('/api/email/send', handleSendEmail);

// Cloudflare R2 Object Storage Endpoints
app.post('/api/storage/upload', handleStorageUpload);

// Cloud Architecture Hub Status (Neon + Clerk + Resend + R2 + Vercel)
app.get('/api/cloud/status', handleCloudArchitectureStatus);

// API Root Health Check
app.get('/api', (req, res) => {
  res.json({
    name: 'FitTrack Serverless API',
    status: 'online',
    version: '1.0.0',
    deployment: 'Vercel Serverless + Neon Postgres',
    security: {
      https: true,
      owaspReviewed: true,
      dataMinimization: true
    }
  });
});

// ====================================================================
// PRODUCTION ERROR HANDLER: STRIP PII & STACK TRACES
// ====================================================================
app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  // Redact personal email or secret tokens from internal server logging
  const safeMessage = (err.message || 'Internal Server Error')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    .replace(/(password|token|key|secret)[=:][^\s&]+/gi, '$1=[REDACTED]');

  res.status(err.status || 500).json({
    success: false,
    error: isProd ? 'A secure server error occurred. Please try again.' : safeMessage,
    code: err.code || 'SERVER_ERROR'
  });
});

export default app;
