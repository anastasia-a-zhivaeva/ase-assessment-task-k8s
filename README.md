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

This service is configured for Kubernetes deployment. See the `kubernetes/` directory for all deployment manifests.

To deploy:

```bash
# Build and push the Docker image
docker build -t ${DOCKER_REGISTRY}/recommendation-service:latest .
docker push ${DOCKER_REGISTRY}/recommendation-service:latest

# Deploy to Kubernetes
kubectl apply -k kubernetes/
```

## API Endpoints

- `GET /recommendations`: Get recommendations based on query parameters
- `GET /health`: Health check endpoint for Kubernetes probes

See the code in `src/modules/recommendation/routes.ts` for more details on available endpoints and request/response formats.