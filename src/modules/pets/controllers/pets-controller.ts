import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreatePetUseCase } from '../factories/make-create-pet-use-case'
import { makeGetPetProfileUseCase } from '../factories/make-get-pet-profile-use-case'
import { makeSearchPetsUseCase } from '../factories/make-search-pets-use-case'
import { OrgNotFoundError } from '@/shared/errors/org-not-found-error'
import { PetNotFoundError } from '@/shared/errors/pet-not-found-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    nome: z.string(),
    descricao: z.string().nullable().optional(),
    idade: z.string(),
    porte: z.string(),
    nivel_energia: z.string(),
    ambiente_ideal: z.string(),
  })

  const data = createPetBodySchema.parse(request.body)
  const org_id = request.user.sub

  try {
    const createPetUseCase = makeCreatePetUseCase()

    const { pet } = await createPetUseCase.execute({ ...data, org_id })

    return reply.status(201).send({ pet })
  } catch (error) {
    if (error instanceof OrgNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    cidade: z.string(),
    idade: z.string().optional(),
    porte: z.string().optional(),
    nivel_energia: z.string().optional(),
  })

  const { cidade, idade, porte, nivel_energia } = searchPetsQuerySchema.parse(request.query)

  const searchPetsUseCase = makeSearchPetsUseCase()

  const { pets } = await searchPetsUseCase.execute({
    cidade,
    filters: {
      ...(idade && { idade }),
      ...(porte && { porte }),
      ...(nivel_energia && { nivel_energia }),
    },
  })

  return reply.status(200).send({ pets })
}

export async function show(request: FastifyRequest, reply: FastifyReply) {
  const getPetParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getPetParamsSchema.parse(request.params)

  try {
    const getPetProfileUseCase = makeGetPetProfileUseCase()

    const { pet } = await getPetProfileUseCase.execute({ pet_id: id })

    return reply.status(200).send({ pet })
  } catch (error) {
    if (error instanceof PetNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
