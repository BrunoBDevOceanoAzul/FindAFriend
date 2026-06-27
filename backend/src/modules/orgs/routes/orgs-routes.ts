import type { FastifyInstance } from 'fastify'
import { register, authenticate } from '../controllers/orgs-controller'
import { show } from '../controllers/orgs-profile-controller'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', register)
  app.post('/sessions', authenticate)
  app.get('/orgs/:id', show)
}
