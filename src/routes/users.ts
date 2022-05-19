import { Static, Type } from '@sinclair/typebox'
import { FastifyInstance, FastifyRequest } from 'fastify'

const ResponseSchema = Type.Array(
  Type.Object({
    username: Type.String(),
  })
)

type ResponseSchema = Static<typeof ResponseSchema>

const schema = {
  response: {
    200: ResponseSchema
  }
}

export default async function users(fastify: FastifyInstance) {
  fastify.get(
    '/users',
    { schema },
    async (req: FastifyRequest): Promise<ResponseSchema> => {
      req.log.info('Users route called')
      try { 
        await req.jwtVerify()
      } catch (err) {
        throw new Error('Auth failed')
      }
      
      const { rows: users } = await fastify.pg.query(
        'SELECT id, username FROM users'
      )
      return users
    }
  )
}
