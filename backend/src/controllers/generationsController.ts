import { Request, Response } from 'express';
// FIX: Using alias: getGenerations as getHistory
import { getGenerations as getHistory, createGeneration } from '../services/generationService';
import { uploadBase64Image } from '../services/fileService';
import { AuthRequest } from '../types/auth';
import { ModelOverloadedError } from '../services/ModelOverloadedError'; 

// Interface for generation request body
interface GenerationRequestBody {
    prompt: string;
    style: string;
    baseImage?: string; // Base64 string of the image
    width: number;
    height: number;
}

/**
 * Controller to fetch the user's generation history.
 */
export async function getGenerationsController(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    try {
        const history = await getHistory(req.user.id);
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching generation history:', error);
        res.status(500).json({ message: 'Failed to fetch history.' });
    }
}

/**
 * Controller to create a new image generation request.
 */
export async function createGenerationController(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const { prompt, style, baseImage, width, height } = req.body as GenerationRequestBody;

    if (!prompt || !style) {
        return res.status(400).json({ message: 'Prompt and style are required.' });
    }

    try {
        // NOTE: Keeping the upload logic here to generate the baseImageUrl, 
        // though the service currently expects the base64 string (`baseImage`).
        let baseImageUrl = null;
        if (baseImage) {
            // Upload the base64 image to the server and get a publicly accessible URL
            baseImageUrl = await uploadBase64Image(baseImage, req.user.id);
        }

        const generation = await createGeneration({
            userId: req.user.id,
            prompt,
            style,
            // This is correct: passes the base64 string or null
            baseImage: baseImage || null,
            width,
            height,
        });

        res.status(201).json(generation);

    } catch (error) {
        console.error('Error during image generation:', error);

        if (error instanceof ModelOverloadedError) {
            return res.status(503).json({ message: error.message });
        }

        res.status(500).json({ message: 'Image generation failed.' });
    }
}
