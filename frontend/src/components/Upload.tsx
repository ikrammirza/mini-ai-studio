import React, { useState } from 'react';
import { resizeImageFile } from '../utils/imageUtils'; // Import the new utility

interface UploadProps {
    onFile: (file: File | null) => void;
    label: string;
}

export const Upload: React.FC<UploadProps> = ({ onFile, label }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            onFile(null);
            setFileName(null);
            return;
        }

        const MAX_SIZE_MB = 10;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
        
        if (file.size > MAX_SIZE_BYTES) {
            alert(`Max file size is ${MAX_SIZE_MB}MB.`);
            onFile(null);
            setFileName(null);
            event.target.value = '';
            return;
        }

        setFileName(file.name);
        
        // --- RESIZING LOGIC ---
        // Resize to max 1920px wide/tall
        const resizedFile = await resizeImageFile(file, 1920, 1920);
        
        console.log(`Image resized. Original size: ${file.size}, Resized size: ${resizedFile.size}`);
        
        onFile(resizedFile);
    };

    return (
        <div className="flex flex-col items-center">
            <label className="w-full text-center bg-blue-500 dark:bg-blue-600 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition">
                {fileName ? `Uploaded: ${fileName}` : label}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label={label}
                />
            </label>
            {fileName && (
                <button 
                    onClick={() => { onFile(null); setFileName(null); }}
                    className="text-xs text-red-500 mt-1"
                >
                    Remove File
                </button>
            )}
        </div>
    );
};