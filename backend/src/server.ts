import { buildApp } from "./app.js";
import { env } from "./config/env";

const start = async () => {
  try {
    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log(
      `Fastify Server listening on http://${env.HOST}:${env.PORT}${env.API_PREFIX}`,
    );
  } catch (err) {
    console.error("Fatal error starting Fastify server:", err);
    process.exit(1);
  }
};

// Start if executed directly
if (process.env.NODE_ENV !== "test") {
  start();
}
