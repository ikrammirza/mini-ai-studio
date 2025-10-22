// frontend/src/hooks/useRetry.ts
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, baseDelay = 300): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isOverloaded = err.response?.status === 503;
      if (isOverloaded && attempt < retries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed after retries");
}
