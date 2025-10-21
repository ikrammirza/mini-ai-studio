"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.signupUser = signupUser;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Note: Replace 'YOUR_JWT_SECRET' with a long, secure, environment-specific secret in a real app.
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secure-default-secret-key-12345';
/**
 * Finds a user by email and checks their password. Generates a JWT on success.
 * @returns { token: string, user: { id: number, email: string } }
 */
async function loginUser(email, passwordAttempt) {
    const user = await prismaClient_1.default.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true }
    });
    if (!user) {
        // Use a generic error message for security
        throw new Error('Invalid credentials');
    }
    // Compare the provided password with the hashed password from the database
    const isPasswordValid = await bcrypt_1.default.compare(passwordAttempt, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    // Create a JWT payload
    const payload = { id: user.id, email: user.email };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    // Exclude the hash from the returned user object
    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
}
/**
 * Registers a new user.
 */
async function signupUser(email, passwordAttempt) {
    // Check if user already exists
    const existingUser = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists.');
    }
    // Hash the password before storing
    const hashedPassword = await bcrypt_1.default.hash(passwordAttempt, 10);
    const newUser = await prismaClient_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        select: { id: true, email: true } // Select only non-sensitive fields to return
    });
    // Generate JWT immediately upon signup
    const payload = { id: newUser.id, email: newUser.email };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    return { token, user: newUser };
}
