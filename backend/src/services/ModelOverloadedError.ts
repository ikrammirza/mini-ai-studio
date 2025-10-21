// This custom error is used when the AI model endpoint is temporarily unavailable or overloaded.

export class ModelOverloadedError extends Error {
    constructor(message: string = "The AI model service is temporarily unavailable due to high traffic.") {
        super(message);
        this.name = "ModelOverloadedError";
        // Set the prototype explicitly. Required for V8 to correctly handle custom errors.
        Object.setPrototypeOf(this, ModelOverloadedError.prototype); 
    }
}
