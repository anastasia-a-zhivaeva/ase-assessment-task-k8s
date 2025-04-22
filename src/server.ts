import cors from "@fastify/cors";
import Fastify from "fastify";

import { routes } from "./modules/recommendation/routes";
import recommendationPlugin from "./modules/recommendation/services/recommendation-service.decorator";

const server = Fastify();
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(recommendationPlugin);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(routes);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
server.register(cors);

if (require.main === module) {
  // called directly i.e. "node server"
  server.listen({ port: 3000 }, (err) => {
    if (err) console.error(err)
    console.log('server listening on 3000')
  })
}

export { server };
