import { FastifyRequest, FastifyReply } from "fastify";

type AsyncHandlerFn = (
  request: FastifyRequest<any>,
  reply: FastifyReply,
) => Promise<any>;

export const asyncHandler = (fn: AsyncHandlerFn) => {
  return async (request: FastifyRequest<any>, reply: FastifyReply) => {
    try {
      await fn(request, reply);
    } catch (error) {
      reply.send(error);
    }
  };
};
