import type { CreatePetDTO, Pet } from '../dtos/create-pet-dto'

export interface PetFilters {
  idade?: string
  porte?: string
  nivel_energia?: string
}

export interface PetsRepository {
  create(data: CreatePetDTO): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  searchMany(cidade: string, filters?: PetFilters): Promise<Pet[]>
}
