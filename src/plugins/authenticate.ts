import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from 'fastify-jwt'
import fp from 'fastify-plugin'

async function authenticate(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> {
  fastify.register(fastifyJwt, {
    secret: opts.JWT_SECRET,
  })

  fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      console.log(5555, req.validationError)
      await req.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
}

export default fp(authenticate)

type AuthenticateType = (req: FastifyRequest, reply: FastifyReply) => Promise<void>
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: AuthenticateType;
  }
}
