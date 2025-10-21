/**
 * Resizes an image file (File or Blob) client-side to a maximum width
 * and returns the resized image as a new File object.
 */
export const resizeImageFile = (
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920
): Promise<File> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 1. Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                // 2. Draw the resized image onto the canvas
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                }
                
                // 3. Convert canvas back to a Blob/File
                canvas.toBlob((blob) => {
                    if (blob) {
                        // Create a new File object from the blob
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    } else {
                        // If conversion fails, return the original file
                        resolve(file); 
                    }
                }, file.type, 0.9); // Quality set to 90%
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = () => resolve(file); // On error, return original file
        reader.readAsDataURL(file);
    });
};