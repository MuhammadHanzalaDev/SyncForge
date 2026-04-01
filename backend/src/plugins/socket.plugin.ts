import fp from "fastify-plugin";
import { initSocket } from "@/lib/socket";

export default fp(async (fastify) => {
  const io = initSocket(fastify.server);

  fastify.decorate("io", io);
});
