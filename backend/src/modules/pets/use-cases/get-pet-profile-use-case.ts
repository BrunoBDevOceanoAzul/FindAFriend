import type { PetsRepository } from '../repositories/pets-repository'
import { PetNotFoundError } from '@/shared/errors/pet-not-found-error'

interface GetPetProfileUseCaseRequest {
  pet_id: string
}

export class GetPetProfileUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ pet_id }: GetPetProfileUseCaseRequest) {
    const pet = await this.petsRepository.findById(pet_id)

    if (!pet) {
      throw new PetNotFoundError()
    }

    return { pet }
  }
}
