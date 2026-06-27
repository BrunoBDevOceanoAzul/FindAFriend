import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { routes } from './routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'findafriend-secret',
})

app.register(fastifyCors, {
  origin: true,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FindAFriend API',
      description: 'API REST para adoção de pets',
      version: '1.0.0',
    },
  },
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(routes)

app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})
