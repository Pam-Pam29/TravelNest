import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (doesn't require database)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API is working without database',
    timestamp: new Date().toISOString()
  });
});

// Simple test route (doesn't use database)
app.get('/api/test', (req, res) => {
  res.json([
    { id: 1, title: "Test Package 1", price: 999, destinations: ["Test City"] },
    { id: 2, title: "Test Package 2", price: 1299, destinations: ["Another City"] }
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;