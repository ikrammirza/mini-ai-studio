# --- Stage 1: Build Stage (Builds the React App) ---
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and run the production build
COPY . .
RUN npm run build

# --- Stage 2: Production/Runtime Stage (Serves the Built App) ---
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install 'serve' package globally to serve the static files easily
RUN npm install -g serve

# Copy the static build output from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Use port 5173 (standard Vite preview port)
ENV PORT 5173
EXPOSE 5173

# Command to serve the built application
CMD ["serve", "-s", "dist", "-l", "tcp://$PORT"]