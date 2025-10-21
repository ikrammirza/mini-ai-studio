"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.signupController = void 0;
// Re-exporting controllers for unified routing imports
const signupController_1 = require("./signupController");
Object.defineProperty(exports, "signupController", { enumerable: true, get: function () { return signupController_1.signupController; } });
const loginController_1 = require("./loginController");
Object.defineProperty(exports, "loginController", { enumerable: true, get: function () { return loginController_1.loginController; } });
