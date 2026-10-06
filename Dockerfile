# VYRO VPN - Production Dockerfile
# Multi-stage build for optimized image size

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production --ignore-scripts || npm install

# Copy source code
COPY . .

# Build the project (creates dist and regenerates zip if needed)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files for production dependencies
COPY package.json package-lock.json* ./

# Install only production dependencies (express)
RUN npm ci --only=production --ignore-scripts || npm install --only=production && \
    npm cache clean --force

# Copy built files from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/server.js ./server.js
COPY --from=builder --chown=nodejs:nodejs /app/vyro-vpn-full-project.zip ./vyro-vpn-full-project.zip

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)throw new Error('Health check failed')}).catch(()=>process.exit(1))" || \
      wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start server
CMD ["node", "server.js"]

# Labels
LABEL maintainer="VYRO Team"
LABEL version="2.5.4"
LABEL description="VYRO VPN — Faster Connection, Stronger Privacy"
LABEL org.opencontainers.image.source="https://github.com/jovanexpress713-jpg/VIP-App"
