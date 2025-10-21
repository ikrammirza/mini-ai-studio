# --- Stage 1: Build Stage (Compiles TypeScript) ---
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy package files first to install dependencies
COPY package*.json ./
RUN npm install

# Copy application code and compile TypeScript to JavaScript (dist)
COPY . .
RUN npx tsc

# --- Stage 2: Production/Runtime Stage (Runs the API) ---
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Create a non-root user for better security
RUN adduser -D appuser
USER appuser

# Copy only the necessary files for production
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/prisma ./prisma
# Copy .env file if used for secrets/keys
COPY --from=build /usr/src/app/.env ./.env

# Create the data directory for the persistent SQLite file (mapped via docker-compose)
RUN mkdir -p /app/data

# Expose the application port
EXPOSE 4000

# The startup command: run Prisma migrations and then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]