import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  handleAnalyzeFoodPhoto,
  handleAiChat,
  handleCalisthenicsApi,
  handleGymApi,
  handleVaultStatus,
  handleNeonHealth,
  handleNeonSync
} from './apiHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Body Parsers
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Protected API Vault Endpoints
app.post('/api/nutrition/analyze-photo', handleAnalyzeFoodPhoto);
app.post('/api/ai/chat', handleAiChat);
app.get('/api/exercises/calisthenics', handleCalisthenicsApi);
app.get('/api/exercises/gym', handleGymApi);
app.get('/api/vault/status', handleVaultStatus);
app.get('/api/db/health', handleNeonHealth);
app.post('/api/db/sync', handleNeonSync);

// Static assets in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🛡️  [FitTrack Secure Vault Server] running on http://localhost:${PORT}`);
  console.log(`   - Gemini Multimodal Vision API: Protected`);
  console.log(`   - Calisthenics Exercise Engine: Protected`);
  console.log(`   - RapidAPI Gym Engine: Protected\n`);
});
