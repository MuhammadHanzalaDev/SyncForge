import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import multipart from "@fastify/multipart";
import errorHandlerPlugin from "./errorHandler.plugin";
import responseWrapperPlugin from "./responseWrapper.plugin";
import authPlugin from "@/modules/auth/auth.plugin";
import socketPlugin from "./socket.plugin";
import { env } from "@/config/env";

const mainPlugin: FastifyPluginAsync = async (app) => {
  // builtin plugins
  await app.register(fastifyCors, {
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
  await app.register(fastifyCookie);
  await app.register(multipart, {
    limits: {
      fileSize: 21 * 1024 * 1024, // 21 MB 
      files: 5, //  max number of files per request
      fields: 20, // max non-file fields
    },
  });

  // custom plugins
  await app.register(errorHandlerPlugin);
  await app.register(responseWrapperPlugin);
  await app.register(authPlugin);
  await app.register(socketPlugin);
};

export default fp(mainPlugin);
