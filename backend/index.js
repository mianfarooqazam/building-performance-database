import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/Auth.js'; 
import protectedRoutes from './routes/protectedRoute.js';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// protected route
app.use('/api/protected', protectedRoutes);

// cross-origin
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
