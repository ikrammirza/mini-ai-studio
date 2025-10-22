import { useState, useRef, useCallback } from 'react';
import { postGeneration } from '../services/api';

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

  const generate = useCallback(async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setAttempts(0);

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    let currentAttempt = 0;

    while (currentAttempt < 3) {
      try {
        currentAttempt++;
        setAttempts(currentAttempt);

        const response = await postGeneration(formData, signal);

        setLoading(false);
        return response.data; // Return new generation object

      } catch (err: any) {
        // User aborted
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          setLoading(false);
          return null;
        }

        // Retry on model overloaded
        const isOverloaded = err.response?.status === 503 && 
                             err.response?.data?.message === "Model overloaded";

        if (isOverloaded && currentAttempt < 3) {
          const delayMs = 300 * Math.pow(2, currentAttempt - 1);
          console.log(`Model overloaded, retrying in ${delayMs}ms (Attempt ${currentAttempt})`);
          await new Promise(r => setTimeout(r, delayMs));
          continue;
        }

        // Final error
        setLoading(false);
        const errorMessage = isOverloaded
          ? "Generation failed: Model overloaded after 3 retries."
          : err.response?.data?.message || "An unknown error occurred.";

        setError(errorMessage);
        throw new Error(errorMessage);
      }
    }
  }, []);

  const abort = useCallback(() => {
    if (controllerRef.current) {
      console.log('Request aborted by user.');
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }, []);

  return { generate, abort, loading, error, attempts };
}
