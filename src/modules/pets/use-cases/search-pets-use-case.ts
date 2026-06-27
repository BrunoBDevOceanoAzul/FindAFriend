import type { PetsRepository } from '../repositories/pets-repository'
import type { PetFilters } from '../repositories/pets-repository'

interface SearchPetsUseCaseRequest {
  cidade: string
  filters?: PetFilters
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ cidade, filters }: SearchPetsUseCaseRequest) {
    const pets = await this.petsRepository.searchMany(cidade, filters)

    return { pets }
  }
}
