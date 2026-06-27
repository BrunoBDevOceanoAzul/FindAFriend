import type { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

async function getPrisma() {
  if (!prisma) {
    const mod = await import('@/lib/prisma')
    prisma = mod.prisma
  }
  return prisma
}

export async function cleanDb() {
  const client = await getPrisma()
  await client.pet.deleteMany()
  await client.org.deleteMany()
}
