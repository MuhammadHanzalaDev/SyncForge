import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { ApiError } from "@/utils/Error";

declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

const authPluggin: FastifyPluginAsync = async (app) => {
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = request.headers.authorization?.split(" ")[1];

        if (!token) {
          throw new ApiError("Unauthorized", 401, "Unauthorized");
        }

        const decoded = jwt.verify(token, env.AUTH_SECRET);

        console.log("decoded", decoded);

        request.user = decoded; // attach user
      } catch (err) {
        throw new ApiError("Invalid Token", 401, "Unauthorized");
      }
    },
  );
};

export default fp(authPluggin);
