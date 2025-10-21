"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenerationsController = getGenerationsController;
exports.createGenerationController = createGenerationController;
// FIX: Using alias: getGenerations as getHistory
const generationService_1 = require("../services/generationService");
const fileService_1 = require("../services/fileService");
const ModelOverloadedError_1 = require("../services/ModelOverloadedError");
/**
 * Controller to fetch the user's generation history.
 */
async function getGenerationsController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    try {
        const history = await (0, generationService_1.getGenerations)(req.user.id);
        res.status(200).json(history);
    }
    catch (error) {
        console.error('Error fetching generation history:', error);
        res.status(500).json({ message: 'Failed to fetch history.' });
    }
}
/**
 * Controller to create a new image generation request.
 */
async function createGenerationController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    const { prompt, style, baseImage, width, height } = req.body;
    if (!prompt || !style) {
        return res.status(400).json({ message: 'Prompt and style are required.' });
    }
    try {
        // NOTE: Keeping the upload logic here to generate the baseImageUrl, 
        // though the service currently expects the base64 string (`baseImage`).
        let baseImageUrl = null;
        if (baseImage) {
            // Upload the base64 image to the server and get a publicly accessible URL
            baseImageUrl = await (0, fileService_1.uploadBase64Image)(baseImage, req.user.id);
        }
        const generation = await (0, generationService_1.createGeneration)({
            userId: req.user.id,
            prompt,
            style,
            // This is correct: passes the base64 string or null
            baseImage: baseImage || null,
            width,
            height,
        });
        res.status(201).json(generation);
    }
    catch (error) {
        console.error('Error during image generation:', error);
        if (error instanceof ModelOverloadedError_1.ModelOverloadedError) {
            return res.status(503).json({ message: error.message });
        }
        res.status(500).json({ message: 'Image generation failed.' });
    }
}
