// backend/src/validators/generationSchema.ts
import { z } from "zod";

export const generationSchema = z.object({
  prompt: z.string().min(3, "Prompt is required"),
  style: z.string().min(2, "Style is required"),
  baseImage: z.string().optional(),
  width: z.number().min(128).max(2048).optional(),
  height: z.number().min(128).max(2048).optional(),
});

export type GenerationInput = z.infer<typeof generationSchema>;
