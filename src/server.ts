import cors from "@fastify/cors";
import Fastify from "fastify";
import * as promClient from "prom-client";

import { routes } from "./modules/recommendation/routes";
import recommendationPlugin from "./modules/recommendation/services/recommendation-service.decorator";

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Enable the default metrics
promClient.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDurationSeconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Register the metrics
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDurationSeconds);

const server = Fastify();

// Register all plugins with void operator to satisfy linter
void server.register(recommendationPlugin);
void server.register(routes);
void server.register(cors);

// Add hook to log and measure request durations
void server.addHook('onRequest', (request, _, done) => {
  request.raw.start = process.hrtime();
  done();
});

void server.addHook('onResponse', (request, reply, done) => {
  const hrtime = process.hrtime(request.raw.start);
  const responseTimeInSeconds = hrtime[0] + (hrtime[1] / 1e9);
  
  const route = request.url;
  const statusCode = reply.statusCode.toString();
  const method = request.method;
  
  // Increment the request counter
  httpRequestsTotal.inc({ method, route, status_code: statusCode });
  
  // Record the request duration
  httpRequestDurationSeconds.observe({ method, route, status_code: statusCode }, responseTimeInSeconds);
  
  // Log the request (optional, for additional visibility)
  request.log.info({
    method,
    url: request.url,
    statusCode,
    responseTime: responseTimeInSeconds,
  });
  
  done();
});

// Add health endpoint for Kubernetes probes
void server.get('/health', (_, reply) => {
  reply.send({ status: 'ok' });
});

// Add Prometheus metrics endpoint
void server.get('/metrics', async (_, reply) => {
  try {
    reply.header('Content-Type', register.contentType);
    reply.send(await register.metrics());
  } catch (err) {
    reply.status(500).send(err);
  }
});

if (require.main === module) {
  // called directly i.e. "node server"
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const host = process.env.HOST || '0.0.0.0'; // Listen on all interfaces for Kubernetes
  
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  server.listen({ port, host }, (err) => {
    if (err) console.error(err)
    console.log(`server listening on ${port}`)
  })
}

export { server };
