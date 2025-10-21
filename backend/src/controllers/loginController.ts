import { Response } from 'express';
import { loginUser } from '../services/authService';
import { AuthRequest } from '../types/auth'; // Ensure this type is available

/**
 * Controller to handle user login.
 */
export async function loginController(req: AuthRequest, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Calls the service layer to authenticate and get a JWT
        const { token, user } = await loginUser(email, password);

        res.status(200).json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);

        // Handle specific authentication failure (like wrong credentials)
        if (error instanceof Error && error.message === 'Invalid credentials') {
            return res.status(401).json({ message: error.message });
        }

        res.status(500).json({ message: 'Login failed.' });
    }
}

