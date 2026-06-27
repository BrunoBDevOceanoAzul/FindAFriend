import { PrismaOrgsRepository } from '@/modules/orgs/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '../repositories/prisma/prisma-pets-repository'
import { CreatePetUseCase } from '../use-cases/create-pet-use-case'

export function makeCreatePetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const useCase = new CreatePetUseCase(petsRepository, orgsRepository)

  return useCase
}
