# Stage 1: Build
FROM node:21-slim AS builder

LABEL maintainer="Shan-Yun Wang <swang308@myseneca.ca>"
LABEL description="Fragments Node.js microservice"

# node.js tooling for production
ENV NODE_ENV=production

# Set environment variables to reduce npm spam and disable color output
ENV NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# We default to use port 8080 in our service
ENV PORT=8080

# Use /app as our working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source files for the build
COPY . .

# Run any necessary build scripts (if applicable)
# RUN npm run build

###################################################################

# Stage 2: Runtime
FROM node:21-slim

# Inherit environment variables
ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Set the working directory
WORKDIR /app

# Copy files from the builder stage
COPY --chown=node:node --from=builder /app /app

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd /app/tests/.htpasswd

# Change the user privilege to least
USER node

# Expose the port
EXPOSE ${PORT}

# Set the default command
CMD ["npm", "start"]

# Check route
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/ || exit 1
