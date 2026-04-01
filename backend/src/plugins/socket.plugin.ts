import fp from "fastify-plugin";
import { initSocket } from "@/config/socket";

export default fp(async (fastify) => {
  const io = initSocket(fastify.server);

  fastify.decorate("io", io);
});
