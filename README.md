# Recommendation Service

A Fastify-based RESTful microservice for providing recommendation data.

## Overview

This service aggregates recommendations from multiple sources and exposes them through a unified API.

## Tech Stack

- **Runtime**: Node.js 
- **Framework**: Fastify
- **Language**: TypeScript
- **Testing**: Jest
- **Deployment**: Kubernetes

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## Deployment

For Kubernetes deployment instructions, see the [K8s Deployment Guide](kubernetes/README.md).

## API Endpoints

- `GET /recommendations`: Get recommendations based on query parameters
- `GET /health`: Health check endpoint for Kubernetes probes

See the code in `src/modules/recommendation/routes.ts` for more details on available endpoints and request/response formats.