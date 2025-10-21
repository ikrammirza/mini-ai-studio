"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const generations_1 = __importDefault(require("./routes/generations"));
const app = (0, express_1.default)();
// Middleware setup
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // To parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true }));
// Static file serving setup (required for Chunk 3, for generated images)
app.use('/static', express_1.default.static('uploads'));
// Routes (Ensure you create these route files separately if you haven't yet)
app.use('/api/auth', auth_1.default);
app.use('/api/generations', generations_1.default);
// Simple health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Basic Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!' });
});
exports.default = app;
