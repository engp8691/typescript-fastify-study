import autoload from '@fastify/autoload'
import fastify from "fastify";
import config from './config'
import path from "path";

console.log(77777, config)
const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
});

server.setErrorHandler(async (error, _req, reply) => {
  server.log.info('MAIN ERROR HANDLER')
  reply.status(500).send(error)
})

server.register(import('@fastify/postgres'), {
  connectionString: config.PG_CONNECTION_STRING
})

server.register(autoload, {
  dir: path.join(__dirname, 'plugins'),
  options: config,
})

// server.register(autoload, {
//   dir: path.join(__dirname, 'controllers'),
//   options: config,
// })

server.register(autoload, {
  dir: path.join(__dirname, 'routers'),
  options: config,
})

export default server;
