import { PrismaPetsRepository } from '../repositories/prisma/prisma-pets-repository'
import { GetPetProfileUseCase } from '../use-cases/get-pet-profile-use-case'

export function makeGetPetProfileUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const useCase = new GetPetProfileUseCase(petsRepository)

  return useCase
}
