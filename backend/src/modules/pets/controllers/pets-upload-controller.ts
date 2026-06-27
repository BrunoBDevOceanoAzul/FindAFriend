import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'
import { join } from 'node:path'
import { prisma } from '@/lib/prisma'
import { uploadsDir } from '@/lib/uploads'
import { PetNotFoundError } from '@/shared/errors/pet-not-found-error'

export async function uploadImages(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const pet = await prisma.pet.findUnique({ where: { id } })
  if (!pet) throw new PetNotFoundError()

  const images: string[] = []
  const parts = request.files()

  for await (const part of parts) {
    const ext = part.filename.split('.').pop() || 'jpg'
    const filename = `${randomUUID()}.${ext}`
    const filepath = join(uploadsDir, filename)

    await pipeline(part.file, createWriteStream(filepath))
    images.push(filename)
  }

  if (images.length === 0) {
    return reply.status(400).send({ message: 'No images uploaded' })
  }

  await prisma.pet.update({
    where: { id },
    data: { imagens: { push: images } },
  })

  return reply.status(201).send({ images })
}
