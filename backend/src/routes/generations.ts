import { Router } from 'express';
import { createGenerationController, getGenerationsController } from '../controllers/generationsController';

import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /generations -> fetch history
router.get('/', getGenerationsController);

// POST /generations -> create generation
router.post('/', createGenerationController);

export default router;
