// backend/routes/protectedRoute.js

import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; // Include .js extension

const router = express.Router();

router.get('/dashboard-data', authMiddleware, (req, res) => {
  // Access req.user if needed
  res.json({ data: 'This is protected data.' });
});

export default router;
