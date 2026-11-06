import express from 'express';
import cors from 'cors';
import {
  handleAnalyzeFoodPhoto,
  handleAiChat,
  handleCalisthenicsApi,
  handleGymApi,
  handleVaultStatus,
  handleNeonHealth,
  handleNeonSync
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
app.get('/api/db/health', handleNeonHealth);
app.post('/api/db/sync', handleNeonSync);

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
