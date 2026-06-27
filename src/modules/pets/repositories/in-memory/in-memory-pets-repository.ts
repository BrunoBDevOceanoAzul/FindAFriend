import type { CreatePetDTO, Pet } from '../../dtos/create-pet-dto'
import type { OrgsRepository } from '@/modules/orgs/repositories/orgs-repository'
import type { PetFilters, PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
  items: Pet[] = []

  constructor(private orgsRepository: OrgsRepository) {}

  async create(data: CreatePetDTO): Promise<Pet> {
    const pet: Pet = {
      id: crypto.randomUUID(),
      nome: data.nome,
      descricao: data.descricao ?? null,
      idade: data.idade,
      porte: data.porte,
      nivel_energia: data.nivel_energia,
      ambiente_ideal: data.ambiente_ideal,
      org_id: data.org_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(pet)
    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    return this.items.find((pet) => pet.id === id) ?? null
  }

  async searchMany(cidade: string, filters?: PetFilters): Promise<Pet[]> {
    const orgs = await this.orgsRepository.findManyByCity(cidade)
    const orgIds = orgs.map((org) => org.id)

    let pets = this.items.filter((pet) => orgIds.includes(pet.org_id))

    if (filters?.idade) {
      pets = pets.filter((pet) => pet.idade === filters.idade)
    }

    if (filters?.porte) {
      pets = pets.filter((pet) => pet.porte === filters.porte)
    }

    if (filters?.nivel_energia) {
      pets = pets.filter((pet) => pet.nivel_energia === filters.nivel_energia)
    }

    return pets
  }
}
