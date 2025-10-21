import prisma from '../prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Note: Replace 'YOUR_JWT_SECRET' with a long, secure, environment-specific secret in a real app.
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secure-default-secret-key-12345'; 

/**
 * Finds a user by email and checks their password. Generates a JWT on success.
 * @returns { token: string, user: { id: number, email: string } }
 */
export async function loginUser(email: string, passwordAttempt: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true }
    });

    if (!user) {
        // Use a generic error message for security
        throw new Error('Invalid credentials'); 
    }

    // Compare the provided password with the hashed password from the database
    const isPasswordValid = await bcrypt.compare(passwordAttempt, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Create a JWT payload
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    // Exclude the hash from the returned user object
    const { password, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
}

/**
 * Registers a new user.
 */
export async function signupUser(email: string, passwordAttempt: string) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists.');
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(passwordAttempt, 10); 

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        select: { id: true, email: true } // Select only non-sensitive fields to return
    });

    // Generate JWT immediately upon signup
    const payload = { id: newUser.id, email: newUser.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return { token, user: newUser };
}
