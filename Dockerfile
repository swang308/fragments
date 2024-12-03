# Stage 1: Build
FROM node:21-slim AS builder

LABEL maintainer="Shan-Yun Wang <swang308@myseneca.ca>"
LABEL description="Fragments Node.js microservice"

# node.js tooling for prodution
ENV NODE_ENV=production

# Set environment variables to reduce npm spam and disable color output
ENV NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# We default to use port 8080 in our service
# ENV PORT=80
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
# ENV PORT=80 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Set the working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=builder /app /app

# Copy source files
COPY . .

# Expose the port and set the default command
EXPOSE ${PORT}
CMD ["npm", "start"]

# Check route
HEALTHCHECK --interval=3m --timeout=30s --start-period=10s --retries=3\
  CMD curl --fail http://localhost:${PORT}/ || exit 1

