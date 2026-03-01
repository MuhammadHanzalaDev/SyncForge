import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import errorHandlerPlugin from "./errorHandler.plugin";
import responseWrapperPlugin from "./responseWrapper.plugin";
import authPlugin from "@/modules/auth/auth.plugin";

const mainPlugin: FastifyPluginAsync = async (app) => {
  await app.register(fastifyCors, {
    origin: true,
    credentials: true,
  });
  await app.register(fastifyCookie);
  await app.register(errorHandlerPlugin);
  await app.register(responseWrapperPlugin);
  await app.register(authPlugin);
};

export default fp(mainPlugin);
