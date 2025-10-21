"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/generations.ts (Ensuring GET is defined)
const express_1 = require("express");
const generationsController_1 = require("../controllers/generationsController");
// import { authMiddleware } from '../middleware/authMiddleware'; // Assuming your middleware import
const router = (0, express_1.Router)();
// Apply authMiddleware to all generations routes
// router.use(authMiddleware); 
// GET /generations?limit=5
router.get('/', generationsController_1.getGenerationsController);
// POST /generations
router.post('/', generationsController_1.createGenerationController);
exports.default = router;
