// backend/src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import prisma from './prismaClient';
import authRoutes from './routes/auth';
import generationsRoutes from './routes/generations';
import { AuthRequest } from './types/auth';
import { PredictionServiceClient, IValue } from '@google-cloud/aiplatform';

const app = express();
const PORT = process.env.PORT || 4000;

// === Middlewares ===
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// === Prisma connection ===
prisma.$connect()
    .then(() => console.log('Prisma client connected successfully.'))
    .catch((error: unknown) => {
        console.error('Failed to connect Prisma client:', error);
        process.exit(1);
    });

// === Authentication mock middleware ===
app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/auth')) return next();
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        (req as AuthRequest).user = { id: 1, email: 'mockuser@example.com' };
    }
    next();
});

// === Health Check ===
app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// === Image Generation Route ===
app.post('/api/generate-image', async (req: Request, res: Response) => {
    try {
        const { prompt, style } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });

        const aiClient = new PredictionServiceClient();
        const fullPrompt = `${prompt}, style: ${style || 'photorealistic'}`;

        const project = 'ai-studio-475723';
        const location = 'us-central1';
        const model = `projects/${project}/locations/${location}/publishers/google/models/gemini-2.5-flash-image`;

        const instances: IValue[] = [{ content: [{ text: fullPrompt }] }];

        const [response] = await aiClient.predict({
            endpoint: `${model}:predict`,
            instances
        });

        const base64Data = response?.predictions?.[0]?.content?.[0]?.image_base64;
        if (!base64Data) throw new Error("No image data returned from API");

        res.json({ imageUrl: `data:image/png;base64,${base64Data}` });

    } catch (error: any) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: error.message });
    }
});

// === Mount Other Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/generations', generationsRoutes);

// === Global Error Handler ===
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Global error handler caught:', err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// === Start Server ===
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
