import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import prisma from './prismaClient';
import authRoutes from './routes/auth';
import generationsRoutes from './routes/generations';
import { AuthRequest } from './types/auth';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import 'dotenv/config';
const app = express();
const PORT = process.env.PORT || 4000;
console.log("GOOGLE_APPLICATION_CREDENTIALS =", process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Prisma
prisma.$connect()
    .then(() => console.log('Prisma client connected successfully.'))
    .catch((error: unknown) => {
        console.error('Failed to connect Prisma client:', error);
        process.exit(1);
    });

// Mock Auth Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/auth')) return next();
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        (req as AuthRequest).user = { id: 1, email: 'mockuser@example.com' };
    }
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/generations', generationsRoutes);

// Image generation route
app.post('/api/generate-image', async (req: Request, res: Response) => {
    try {
        const { prompt, style } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required" });

        const aiClient = new PredictionServiceClient();
        const fullPrompt = `${prompt}, style: ${style || 'photorealistic'}`;

        const project = 'ai-studio-475723';
        const location = 'us-central1';
        const model = `projects/${project}/locations/${location}/publishers/google/models/gemini-2.5-flash-image`;

        // ✅ Correctly destructure the response
        const [response] = await aiClient.predict({
            endpoint: `${model}:predict`,
            instances: [{ prompt: fullPrompt } as any],
        });

        // Now response is IPredictResponse
        const base64Data = (response as any).predictions?.[0]?.content?.[0]?.image_base64;

        if (!base64Data) throw new Error("No image data returned from API");

        res.json({ imageUrl: `data:image/png;base64,${base64Data}` });
    } catch (error: any) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: error.message });
    }
});


// Serve React build (production)
const buildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(buildPath));

// For SPA routing: always return index.html for unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler caught:', err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
