import { PrismaOrgsRepository } from '../repositories/prisma/prisma-orgs-repository'
import { AuthenticateOrgUseCase } from '../use-cases/authenticate-org-use-case'

export function makeAuthenticateOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const useCase = new AuthenticateOrgUseCase(orgsRepository)

  return useCase
}
