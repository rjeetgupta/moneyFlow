import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env';

export const buildApp = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: env.NODE_ENV !== 'production',
  });


  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  return fastify;
};
