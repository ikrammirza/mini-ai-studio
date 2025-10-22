// backend/src/controllers/generationsController.ts
import { Request, Response } from 'express';
import { getGenerations as getHistory, createGeneration } from '../services/generationService';
import { uploadBase64Image } from '../services/fileService';
import { AuthRequest } from '../types/auth';
import { ModelOverloadedError } from '../services/ModelOverloadedError';
import { generationSchema } from '../validators/generationSchema';

// Interface for generation request body
interface GenerationRequestBody {
  prompt: string;
  style?: string;
  baseImage?: string;
  width?: number;
  height?: number;
}

/**
 * Controller to fetch the user's generation history.
 */
export async function getGenerationsController(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const limit = Number(req.query.limit) || 5;

  try {
    const history = await getHistory(req.user.id, limit);
    return res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ message: 'Failed to fetch history.' });
  }
}

/**
 * Controller to create a new image generation request.
 */
export async function createGenerationController(req: AuthRequest, res: Response) {
  // Simulate model overload
  if (Math.random() < 0.2) {
    return res.status(503).json({ message: "Model overloaded" });
  }

  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // Validate request body
  const parsed = generationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.errors,
    });
  }

  const { prompt, style = 'photorealistic', baseImage, width = 1024, height = 1024 } = parsed.data;

  try {
    let baseImageUrl: string | null = null;

    if (baseImage) {
      baseImageUrl = await uploadBase64Image(baseImage, req.user.id);
    }

    const generation = await createGeneration({
      userId: req.user.id,
      prompt,
      style,
      baseImage: baseImageUrl,
      width,
      height,
    });

    return res.status(201).json(generation);

  } catch (error) {
    console.error('Error during image generation:', error);

    if (error instanceof ModelOverloadedError) {
      return res.status(503).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Image generation failed.' });
  }
}
