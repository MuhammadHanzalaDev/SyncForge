import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { ZodError } from "zod";
import { formatZodError } from "@/utils/Error";

const errorHandler: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error: any, request, reply) => {
    const status = error.status ?? error.statusCode ?? 500;
    console.log(error);
    if (error instanceof ZodError) {
      const formatted = formatZodError(error);
      return reply.code(400).send({
        success: false,
        statusCode: status,
        error: "ValidationError",
        errors: formatted,
      });
    }

    // Prisma errors
    if (error.code === "P2002") {
      // unique constraint
      return reply.code(400).send({
        success: false,
        statusCode: status,
        error: "PrismaError",
        message: "Unique constraint failed",
      });
    }


    reply.code(status).send({
      success: false,
      statusCode: status,
      message: error.message || "Internal Server Error",
      error: error.name || "Error",
      ...(Object.keys(error?.data)?.length > 0 ? { data: error.data } : {}),
    });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      statusCode: 404,
      message: "Resource not found",
      error: "NotFound",
    });
  });
};

export default fp(errorHandler);
