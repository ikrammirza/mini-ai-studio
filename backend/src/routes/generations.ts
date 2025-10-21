// src/routes/generations.ts (Ensuring GET is defined)
import { Router } from 'express';
import { getGenerationsController, createGenerationController } from '../controllers/generationsController';
// import { authMiddleware } from '../middleware/authMiddleware'; // Assuming your middleware import

const router = Router();

// Apply authMiddleware to all generations routes
// router.use(authMiddleware); 

// GET /generations?limit=5
router.get('/', getGenerationsController); 

// POST /generations
router.post('/', createGenerationController); 

export default router;