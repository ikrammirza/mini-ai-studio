import prisma from '../prismaClient';
import { ModelOverloadedError } from './ModelOverloadedError';

// Define the expected structure for a generation creation payload
interface GenerationCreationPayload {
    userId: number;
    prompt: string;
    style: string;
    // This is the Base64 string from the controller
    baseImage: string | null; 
    width: number; // Keep in payload for the AI call
    height: number; // Keep in payload for the AI call
}

// Mock function for calling the external image generation API (Gemini/Imagen)
async function callExternalGenerationApi(payload: GenerationCreationPayload): Promise<string> {
    // In a real application, this would be an actual API call to an AI service.
    console.log(`Simulating external AI call for user ${payload.userId} with prompt: ${payload.prompt}`);

    // Simulate an occasional overload or failure
    if (Math.random() < 0.05) { // 5% chance of failure
        throw new ModelOverloadedError();
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
export async function getGenerations(userId: number, limit: number = 20) {
    const history = await prisma.generation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    return history;
}

/**
 * Creates a new image generation entry and calls the external AI service.
 */
export async function createGeneration(payload: GenerationCreationPayload) {
    const { userId, prompt, style, baseImage, width, height } = payload;
    
    // 1. Call the external AI service to get the final image URL
    const generatedImageUrl = await callExternalGenerationApi(payload);

    // 2. Save the generation to the database
    const newGeneration = await prisma.generation.create({
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
