import express from 'express';
import cors from 'cors';
import {
  handleAnalyzeFoodPhoto,
  handleAiChat,
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

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Vercel Serverless API Routes
app.post('/api/nutrition/analyze-photo', handleAnalyzeFoodPhoto);
app.post('/api/ai/chat', handleAiChat);
app.get('/api/exercises/calisthenics', handleCalisthenicsApi);
app.get('/api/exercises/gym', handleGymApi);
app.get('/api/vault/status', handleVaultStatus);

// Neon PostgreSQL Endpoints
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

// Health check
app.get('/api', (req, res) => {
  res.json({
    name: 'FitTrack Serverless API',
    status: 'online',
    version: '1.0.0',
    deployment: 'Vercel Serverless + Neon Postgres'
  });
});

export default app;
