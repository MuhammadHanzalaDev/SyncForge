import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;

    io: Server;
  }

  interface FastifyContextConfig {
    multipart?: {
      limits?: {
        fileSize?: number;
      };
    };
  }
}
