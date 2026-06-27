import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRegisterOrgUseCase } from '../factories/make-register-org-use-case'
import { makeAuthenticateOrgUseCase } from '../factories/make-authenticate-org-use-case'
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha: z.string().min(6),
    cep: z.string(),
    endereco: z.string(),
    whatsapp: z.string(),
    cidade: z.string(),
  })

  const data = registerBodySchema.parse(request.body)

  try {
    const registerOrgUseCase = makeRegisterOrgUseCase()

    await registerOrgUseCase.execute(data)

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    senha: z.string(),
  })

  const { email, senha } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateOrgUseCase = makeAuthenticateOrgUseCase()

    const { org } = await authenticateOrgUseCase.execute({ email, senha })

    const token = await reply.jwtSign({}, { sub: org.id })

    return reply.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
