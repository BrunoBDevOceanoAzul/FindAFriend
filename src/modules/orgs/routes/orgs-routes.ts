import type { FastifyInstance } from 'fastify'
import { register, authenticate } from '../controllers/orgs-controller'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', register)
  app.post('/sessions', authenticate)
}
