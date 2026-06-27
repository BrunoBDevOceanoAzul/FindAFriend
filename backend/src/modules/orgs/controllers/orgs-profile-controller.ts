import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export async function show(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const org = await prisma.org.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      cep: true,
      endereco: true,
      whatsapp: true,
      cidade: true,
      latitude: true,
      longitude: true,
    },
  })

  if (!org) {
    return reply.status(404).send({ message: 'Org not found' })
  }

  return reply.status(200).send({ org })
}
