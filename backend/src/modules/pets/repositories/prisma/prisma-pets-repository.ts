import type { CreatePetDTO, Pet } from '../../dtos/create-pet-dto'
import type { PetFilters, PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: CreatePetDTO): Promise<Pet> {
    const pet = await prisma.pet.create({ data })
    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({ where: { id } })
    return pet
  }

  async update(id: string, data: Partial<CreatePetDTO>): Promise<Pet> {
    const pet = await prisma.pet.update({ where: { id }, data })
    return pet
  }

  async delete(id: string): Promise<void> {
    await prisma.pet.delete({ where: { id } })
  }

  async searchMany(cidade: string, filters?: PetFilters): Promise<Pet[]> {
    const orgs = await prisma.org.findMany({
      where: { cidade },
      select: { id: true },
    })

    const orgIds = orgs.map((org) => org.id)

    const pets = await prisma.pet.findMany({
      where: {
        org_id: { in: orgIds },
        ...(filters?.idade && { idade: filters.idade }),
        ...(filters?.porte && { porte: filters.porte }),
        ...(filters?.nivel_energia && { nivel_energia: filters.nivel_energia }),
      },
    })

    return pets
  }
}
