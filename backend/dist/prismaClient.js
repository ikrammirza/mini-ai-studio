"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Connect the Prisma Client to the database on application startup
async function connectToDb() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database.');
    }
    catch (e) {
        console.error('Database connection failed:', e);
        // We can optionally exit the process if the database is critical
        // process.exit(1); 
    }
}
connectToDb();
exports.default = prisma;
