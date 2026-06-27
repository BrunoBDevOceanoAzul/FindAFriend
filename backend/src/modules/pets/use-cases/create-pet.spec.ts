import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/modules/orgs/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { CreatePetUseCase } from './create-pet-use-case'
import { OrgNotFoundError } from '@/shared/errors/org-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: CreatePetUseCase

describe('CreatePetUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should create a pet linked to an existing org', async () => {
    const org = await orgsRepository.create({
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      password_hash: 'hash123',
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })

    const { pet } = await sut.execute({
      nome: 'Rex',
      descricao: 'Cão amigável',
      idade: 'ADULTO',
      porte: 'GRANDE',
      nivel_energia: 'ALTA',
      ambiente_ideal: 'AMPLO',
      org_id: org.id,
    })

    expect(pet.id).toBeDefined()
    expect(pet.nome).toBe('Rex')
    expect(pet.org_id).toBe(org.id)
  })

  it('should not create a pet for a non-existent org', async () => {
    await expect(
      sut.execute({
        nome: 'Rex',
        idade: 'ADULTO',
        porte: 'GRANDE',
        nivel_energia: 'ALTA',
        ambiente_ideal: 'AMPLO',
        org_id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(OrgNotFoundError)
  })
})
