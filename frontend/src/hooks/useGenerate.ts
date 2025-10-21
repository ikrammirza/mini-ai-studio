// frontend/src/hooks/useGenerate.ts
import { useState, useRef, useCallback } from 'react';
import { postGeneration } from '../services/api'; // Import your service

// Custom error for abort/cancellation to distinguish from other failures
export class AbortError extends Error {
  constructor(message: string = "Request aborted by user") {
    super(message);
    this.name = 'AbortError';
  }
}

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  // Function to encapsulate the generation and retry logic
  const doGenerate = useCallback(async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setAttempts(0);

    // Create a new controller for this attempt cycle
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    let currentAttempt = 0;
    while (currentAttempt < 3) {
      try {
        currentAttempt++;
        setAttempts(currentAttempt);

        // 1. Call the API with the AbortSignal
        const response = await postGeneration(formData, signal);

        // 2. Success
        setLoading(false);
        return response.data; // Return the new Generation object

      } catch (err: any) {
        // Check for Abort (user clicked cancel)
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          setLoading(false);
          // throw new AbortError(); // Propagate the cancellation
          return null; // Return null on user abort
        }

        // Check for 503 Overloaded Error (Retry Logic)
        const isOverloaded = err.response?.status === 503 && 
                             err.response?.data?.message === "Model overloaded";

        if (isOverloaded && currentAttempt < 3) {
          // Calculate exponential backoff: 300ms, 600ms, 1200ms
          const delayMs = 300 * Math.pow(2, currentAttempt - 1);
          console.log(`Model overloaded, retrying in ${delayMs}ms (Attempt ${currentAttempt})`);
          await new Promise(r => setTimeout(r, delayMs));
          // 'continue' keyword goes to the next iteration of the while loop
          continue; 
        }

        // Handle final failure (after retries) or other errors (400, 500, etc.)
        setLoading(false);
        const errorMessage = isOverloaded 
          ? "Generation failed: Model overloaded after 3 retries." 
          : err.response?.data?.message || "An unknown error occurred.";
          
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    }
  }, []);

  // Function to abort the current request cycle
  const abort = useCallback(() => {
    if (controllerRef.current) {
      console.log('Request aborted by user.');
      controllerRef.current.abort();
    }
  }, []);

  // Return the necessary state and functions
  return { generate: doGenerate, abort, loading, error, attempts };
}