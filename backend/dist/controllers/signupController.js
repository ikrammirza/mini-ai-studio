"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = signupController;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../prismaClient")); // prisma client instance
const zod_1 = require("zod");
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
async function signupController(req, res) {
    const parse = signupSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.errors });
    const { email, password } = parse.data;
    const existing = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ error: "Email already exists" });
    const hash = await bcrypt_1.default.hash(password, 10);
    const user = await prismaClient_1.default.user.create({ data: { email, password: hash } });
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
}
