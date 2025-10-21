"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenerations = getGenerations;
exports.createGeneration = createGeneration;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const ModelOverloadedError_1 = require("./ModelOverloadedError");
// Mock function for calling the external image generation API (Gemini/Imagen)
async function callExternalGenerationApi(payload) {
    // In a real application, this would be an actual API call to an AI service.
    console.log(`Simulating external AI call for user ${payload.userId} with prompt: ${payload.prompt}`);
    // Simulate an occasional overload or failure
    if (Math.random() < 0.05) { // 5% chance of failure
        throw new ModelOverloadedError_1.ModelOverloadedError();
    }
    // Generate a placeholder image URL based on the prompt
    const placeholderText = encodeURIComponent(payload.prompt.substring(0, 20).trim() || 'AI Image');
    // Returns a placeholder image URL
    const imageUrl = `https://placehold.co/${payload.width}x${payload.height}/1e1e1e/ffffff?text=${placeholderText}`;
    // Simulate latency for the AI generation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    return imageUrl;
}
/**
 * Retrieves the generation history for a specific user.
 * This function is imported as `getHistory` in the controller via aliasing.
 */
async function getGenerations(userId, limit = 20) {
    const history = await prismaClient_1.default.generation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return history;
}
/**
 * Creates a new image generation entry and calls the external AI service.
 */
async function createGeneration(payload) {
    const { userId, prompt, style, baseImage, width, height } = payload;
    // 1. Call the external AI service to get the final image URL
    const generatedImageUrl = await callExternalGenerationApi(payload);
    // 2. Save the generation to the database
    const newGeneration = await prismaClient_1.default.generation.create({
        data: {
            userId,
            prompt,
            style,
            imageUrl: generatedImageUrl,
            status: 'COMPLETED',
            // FIX: Removed 'width' and 'height' as they do not exist in the Generation schema
        },
    });
    return newGeneration;
}
