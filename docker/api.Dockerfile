FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY api/package.json ./
RUN npm install

# Copy source code
COPY api/src ./src
COPY shared ./shared
COPY api/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY api/package.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared

EXPOSE 3001

CMD ["node", "dist/src/index.js"]

