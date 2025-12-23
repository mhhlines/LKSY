FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY api/package.json api/package-lock.json* ./
RUN npm ci --only=production

# Copy source code
COPY api/src ./src
COPY shared ./shared
COPY api/tsconfig.json ./

# Build TypeScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]

