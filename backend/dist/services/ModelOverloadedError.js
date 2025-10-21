"use strict";
// This custom error is used when the AI model endpoint is temporarily unavailable or overloaded.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelOverloadedError = void 0;
class ModelOverloadedError extends Error {
    constructor(message = "The AI model service is temporarily unavailable due to high traffic.") {
        super(message);
        this.name = "ModelOverloadedError";
        // Set the prototype explicitly. Required for V8 to correctly handle custom errors.
        Object.setPrototypeOf(this, ModelOverloadedError.prototype);
    }
}
exports.ModelOverloadedError = ModelOverloadedError;
