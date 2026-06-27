import type { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/shared/middlewares/verify-jwt'
import { create, search, show, update, remove } from '../controllers/pets-controller'
import { uploadImages } from '../controllers/pets-upload-controller'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJwt] }, create)
  app.post('/pets/:id/images', { onRequest: [verifyJwt] }, uploadImages)
  app.patch('/pets/:id', { onRequest: [verifyJwt] }, update)
  app.delete('/pets/:id', { onRequest: [verifyJwt] }, remove)
  app.get('/pets', search)
  app.get('/pets/:id', show)
}
