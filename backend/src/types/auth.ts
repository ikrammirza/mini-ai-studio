import { Request } from 'express';

// Define the shape of the user object attached to the request after authentication middleware runs
interface UserPayload {
    id: number;
    email: string;
    // Add any other necessary fields
}

// Custom Request type to include the authenticated user object
export interface AuthRequest extends Request {
    user?: UserPayload;
}
