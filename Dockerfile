# ---------------------------
# 1. Builder Stage
# ---------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files (better caching)
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript → JavaScript
RUN npm run build


# ---------------------------
# 2. Production Stage
# ---------------------------
FROM node:18-alpine

WORKDIR /app

# Copy only package files again
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist

# Expose API port
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]
