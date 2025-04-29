import cors from "@fastify/cors";
import Fastify from "fastify";
import metricsPlugin from "fastify-metrics";

import { routes } from "./modules/recommendation/routes";
import recommendationPlugin from "./modules/recommendation/services/recommendation-service.decorator";

const server = Fastify();

// Register all plugins
server.register(metricsPlugin, {
  endpoint: '/metrics',
});
server.register(recommendationPlugin);
server.register(routes);
server.register(cors);

// Add separate endpoints for Kubernetes liveness and readiness probes
server.get('/health/live', (_, reply) => {
  reply.send({ status: 'ok' });
});

server.get('/health/ready', (_, reply) => {
  // For readiness, we could add more checks here in the future
  reply.send({ status: 'ok' });
});

// Keep the general health endpoint for backward compatibility
server.get('/health', (_, reply) => {
  reply.send({ status: 'ok' });
});

if (require.main === module) {
  // called directly i.e. "node server"
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const host = process.env.HOST ?? '0.0.0.0'; // Listen on all interfaces for Kubernetes
  
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  server.listen({ port, host }, (err) => {
    if (err) console.error(err);
    console.log(`server listening on ${port}`);
  });
}

export { server };
