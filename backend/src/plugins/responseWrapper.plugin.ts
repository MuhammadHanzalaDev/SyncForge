import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";

const responseWrapper: FastifyPluginAsync = async (app) => {
  app.addHook(
    "preSerialization",
    async (request: FastifyRequest, reply: FastifyReply, payload) => {
      if (reply.statusCode >= 400) {
        return payload; // error handler already handled it
      }

      // Skip streams or raw content
      const contentType = reply.getHeader("content-type")?.toString() || "";
      if (contentType.includes("application/octet-stream")) return payload;

      // Skip if already formatted
      if ((reply as any).isFormatted) return payload;

      (reply as any).isFormatted = true;

      return {
        success: reply.statusCode < 400,
        statusCode: reply.statusCode,
        data: payload,
      };
    },
  );
};

export default fp(responseWrapper);
