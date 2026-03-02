import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "@/utils/Error";
import { AuthJwtPayload } from "./auth.types";
import { verifyAccessToken } from "./auth.utils";

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
          throw new ApiError("No Token", 401, "Unauthorized");
        }

        const decoded = verifyAccessToken(token) as AuthJwtPayload;

        if (typeof decoded === "string" || !decoded.userId) {
          throw new ApiError("Invalid Token Payload", 401, "Unauthorized");
        }

        request.user = { userId: decoded?.userId }; // attach user
      } catch (err) {
        throw new ApiError("Invalid Token", 401, "Unauthorized");
      }
    },
  );
};

export default fp(authPluggin);
