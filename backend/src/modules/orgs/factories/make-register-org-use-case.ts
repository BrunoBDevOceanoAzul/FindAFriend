import { PrismaOrgsRepository } from '../repositories/prisma/prisma-orgs-repository'
import { RegisterOrgUseCase } from '../use-cases/register-org-use-case'

export function makeRegisterOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const useCase = new RegisterOrgUseCase(orgsRepository)

  return useCase
}
