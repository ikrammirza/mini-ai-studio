import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the directory for static file storage
const STATIC_DIR = path.join(process.cwd(), 'public', 'images');
// IMPORTANT: Adjust this if your API is running on a different port or domain
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000'; 

// Ensure the directory exists. In a full project, Express needs to be configured to serve this directory.
if (!fs.existsSync(STATIC_DIR)) {
    fs.mkdirSync(STATIC_DIR, { recursive: true });
}

/**
 * Uploads a base64 encoded image string to the local filesystem and returns the public URL.
 * @param base64Image The base64 image string (e.g., "data:image/png;base64,iVBORw0KGg...").
 * @param userId The ID of the user creating the image (for path separation/organization).
 * @returns The public URL where the image can be accessed.
 */
export async function uploadBase64Image(base64Image: string, userId: number): Promise<string> {
    const parts = base64Image.split(';');
    const mimeTypePart = parts[0];
    const dataPart = parts[1];
    
    // 1. Extract MIME type and image data
    const mimeTypeMatch = mimeTypePart.match(/data:(image\/\w+)/);
    if (!mimeTypeMatch) {
        throw new Error('Invalid base64 image format: missing MIME type.');
    }
    const extension = mimeTypeMatch[1].split('/')[1]; // e.g., 'png'

    const base64Data = dataPart.split(',')[1];
    if (!base64Data) {
        throw new Error('Invalid base64 image format: missing data part.');
    }

    // 2. Generate file name and path
    const fileName = `${uuidv4()}.${extension}`;
    
    // Create a sub-folder per user
    const userDir = path.join(STATIC_DIR, userId.toString());
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    const filePath = path.join(userDir, fileName);

    // 3. Write the file to disk
    const imageBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, imageBuffer);

    // 4. Return the public URL
    // Public URL format: [BASE_URL]/images/[userId]/[fileName]
    const publicPath = `/images/${userId}/${fileName}`;
    return `${BASE_URL.replace(/\/api$/, '')}${publicPath}`;
}
