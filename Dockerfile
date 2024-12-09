# Stage 1: Build
FROM node:21-slim AS builder

LABEL maintainer="Shan-Yun Wang <swang308@myseneca.ca>"
LABEL description="Fragments Node.js microservice"

ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false
ENV PORT=8080

WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the application source code (including src/index.js)
COPY . . 

# Stage 2: Runtime
FROM node:21-slim

# Install Docker CLI and dependencies
# RUN apt-get update && apt-get install -y docker.io && rm -rf /var/lib/apt/lists/*

ENV PORT=8080

WORKDIR /app

# Copy files from the builder stage
COPY --from=builder /app /app

# Change the user privilege to least
USER node

# Set the default command
CMD ["npm", "start"]

# Expose the port
EXPOSE ${PORT}

# Healthcheck for container
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/ || exit 1
