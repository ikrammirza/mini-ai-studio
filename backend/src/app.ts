import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth'; 
import generationRoutes from './routes/generations';

const app: Application = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); 

// Static file serving setup (required for Chunk 3, for generated images)
app.use('/static', express.static('uploads'));

// Routes (Ensure you create these route files separately if you haven't yet)
app.use('/api/auth', authRoutes); 
app.use('/api/generations', generationRoutes);

// Simple health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

// Basic Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!' });
});

export default app;