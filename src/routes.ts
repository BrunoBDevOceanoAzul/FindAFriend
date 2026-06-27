import type { FastifyInstance } from 'fastify'
import { orgsRoutes } from './modules/orgs/routes/orgs-routes'
import { petsRoutes } from './modules/pets/routes/pets-routes'

export async function routes(app: FastifyInstance) {
  await app.register(orgsRoutes)
  await app.register(petsRoutes)
}
