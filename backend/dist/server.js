"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const prismaClient_1 = __importDefault(require("./prismaClient")); // FIX: Changed import name to 'prisma' (the client instance)
const auth_1 = __importDefault(require("./routes/auth"));
const generations_1 = __importDefault(require("./routes/generations"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Connect to Prisma DB before starting the server
// FIX: We now call a method on the client instance to verify the connection, 
// rather than wrapping the import in a function call.
prismaClient_1.default.$connect()
    .then(() => {
    console.log('Prisma client connected successfully.');
})
    .catch((error) => {
    console.error('Failed to connect Prisma client:', error);
    process.exit(1);
});
// Middlewares
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
// Use body-parser for JSON data (required for large base64 images)
// Set limit high to handle image data transfers
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
// Custom Authentication Middleware (Mock or Real)
// A real authentication middleware would parse the JWT from the header,
// validate it, and attach the user object (req.user) to the request.
// For this environment, we'll keep it minimal or rely on a mock/placeholder.
app.use((req, res, next) => {
    // This is a minimal placeholder for auth check. 
    // In a real scenario, this would check JWT and populate req.user.
    // For now, assume a mock user for simplicity in development flow
    // IMPORTANT: Actual user check and population should be done by dedicated middleware on protected routes.
    // Bypass auth for login/signup
    if (req.path.startsWith('/api/auth')) {
        return next();
    }
    // Mock authentication for API routes
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // In a real app, validate token here.
        // Mock user object attachment
        req.user = {
            id: 1, // Mock user ID 1
            email: 'mockuser@example.com'
        };
    }
    else {
        // If no token, still let it pass for development, but the controller must check for req.user
    }
    next();
});
// Public API routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});
// App routes
app.use('/api/auth', auth_1.default);
app.use('/api/generations', generations_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global error handler caught:', err.stack);
    res.status(500).json({
        message: 'Something went wrong on the server.',
        error: err.message
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
