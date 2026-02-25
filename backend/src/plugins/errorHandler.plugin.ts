import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

const errorHandler: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error: any, request, reply) => {
    const status = error.status ?? error.statusCode ?? 500;

    reply.code(status).send({
      success: false,
      statusCode: status,
      message: error.message || "Internal Server Error",
      error: error.name || "Error",
    });
  });
};

export default fp(errorHandler);