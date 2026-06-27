import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/modules/orgs/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { GetPetProfileUseCase } from './get-pet-profile-use-case'
import { PetNotFoundError } from '@/shared/errors/pet-not-found-error'
import type { CreatePetDTO } from '../dtos/create-pet-dto'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: GetPetProfileUseCase

describe('GetPetProfileUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetProfileUseCase(petsRepository)
  })

  it('should return pet details by id', async () => {
    const org = await orgsRepository.create({
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      password_hash: 'hash123',
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })

    const createdPet = await petsRepository.create({
      nome: 'Rex',
      idade: 'ADULTO',
      porte: 'GRANDE',
      nivel_energia: 'ALTA',
      ambiente_ideal: 'AMPLO',
      org_id: org.id,
    } as CreatePetDTO)

    const { pet } = await sut.execute({ pet_id: createdPet.id })

    expect(pet.nome).toBe('Rex')
    expect(pet.org_id).toBe(org.id)
    expect(pet.porte).toBe('GRANDE')
  })

  it('should throw error for non-existent pet', async () => {
    await expect(
      sut.execute({ pet_id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(PetNotFoundError)
  })
})
