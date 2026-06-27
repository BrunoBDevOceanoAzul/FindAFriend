import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/modules/orgs/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { SearchPetsUseCase } from './search-pets-use-case'
import type { CreatePetDTO } from '../dtos/create-pet-dto'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: SearchPetsUseCase

describe('SearchPetsUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new SearchPetsUseCase(petsRepository)
  })

  it('should return pets filtered by city', async () => {
    const orgSP = await orgsRepository.create({
      nome: 'ONG SP',
      email: 'sp@teste.com',
      password_hash: 'hash123',
      cep: '01001-000',
      endereco: 'Rua SP, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })

    const orgRJ = await orgsRepository.create({
      nome: 'ONG RJ',
      email: 'rj@teste.com',
      password_hash: 'hash123',
      cep: '20000-000',
      endereco: 'Rua RJ, 456',
      whatsapp: '21999999999',
      cidade: 'Rio de Janeiro',
    })

    await petsRepository.create({
      nome: 'Rex',
      idade: 'ADULTO',
      porte: 'GRANDE',
      nivel_energia: 'ALTA',
      ambiente_ideal: 'AMPLO',
      org_id: orgSP.id,
    } as CreatePetDTO)

    await petsRepository.create({
      nome: 'Mimi',
      idade: 'FILHOTE',
      porte: 'PEQUENO',
      nivel_energia: 'BAIXA',
      ambiente_ideal: 'FECHADO',
      org_id: orgRJ.id,
    } as CreatePetDTO)

    const { pets } = await sut.execute({ cidade: 'São Paulo' })

    expect(pets).toHaveLength(1)
    expect(pets[0].nome).toBe('Rex')
  })

  it('should return empty array when no pets in city', async () => {
    const { pets } = await sut.execute({ cidade: 'Curitiba' })

    expect(pets).toHaveLength(0)
  })

  it('should filter by porte', async () => {
    const org = await orgsRepository.create({
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      password_hash: 'hash123',
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })

    await petsRepository.create({
      nome: 'Rex',
      idade: 'ADULTO',
      porte: 'GRANDE',
      nivel_energia: 'ALTA',
      ambiente_ideal: 'AMPLO',
      org_id: org.id,
    } as CreatePetDTO)

    await petsRepository.create({
      nome: 'Tobby',
      idade: 'ADULTO',
      porte: 'PEQUENO',
      nivel_energia: 'BAIXA',
      ambiente_ideal: 'FECHADO',
      org_id: org.id,
    } as CreatePetDTO)

    const { pets } = await sut.execute({
      cidade: 'São Paulo',
      filters: { porte: 'PEQUENO' },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].nome).toBe('Tobby')
  })

  it('should filter by idade', async () => {
    const org = await orgsRepository.create({
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      password_hash: 'hash123',
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })

    await petsRepository.create({
      nome: 'Rex',
      idade: 'ADULTO',
      porte: 'GRANDE',
      nivel_energia: 'ALTA',
      ambiente_ideal: 'AMPLO',
      org_id: org.id,
    } as CreatePetDTO)

    await petsRepository.create({
      nome: 'Pipoca',
      idade: 'FILHOTE',
      porte: 'PEQUENO',
      nivel_energia: 'ALTA',
      ambiente_ideal: 'FECHADO',
      org_id: org.id,
    } as CreatePetDTO)

    const { pets } = await sut.execute({
      cidade: 'São Paulo',
      filters: { idade: 'FILHOTE' },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].nome).toBe('Pipoca')
  })

  it('should filter by nivel_energia', async () => {
    const org = await orgsRepository.create({
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      password_hash: 'hash123',
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })

    await petsRepository.create({
      nome: 'Rex',
      idade: 'ADULTO',
      porte: 'GRANDE',
      nivel_energia: 'ALTA',
      ambiente_ideal: 'AMPLO',
      org_id: org.id,
    } as CreatePetDTO)

    await petsRepository.create({
      nome: 'Preguiça',
      idade: 'ADULTO',
      porte: 'GRANDE',
      nivel_energia: 'BAIXA',
      ambiente_ideal: 'FECHADO',
      org_id: org.id,
    } as CreatePetDTO)

    const { pets } = await sut.execute({
      cidade: 'São Paulo',
      filters: { nivel_energia: 'BAIXA' },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].nome).toBe('Preguiça')
  })

  it('should combine multiple filters', async () => {
    const org = await orgsRepository.create({
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      password_hash: 'hash123',
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })

    await petsRepository.create({
      nome: 'Rex',
      idade: 'ADULTO',
      porte: 'GRANDE',
      nivel_energia: 'ALTA',
      ambiente_ideal: 'AMPLO',
      org_id: org.id,
    } as CreatePetDTO)

    await petsRepository.create({
      nome: 'Tobby',
      idade: 'ADULTO',
      porte: 'PEQUENO',
      nivel_energia: 'BAIXA',
      ambiente_ideal: 'FECHADO',
      org_id: org.id,
    } as CreatePetDTO)

    await petsRepository.create({
      nome: 'Pipoca',
      idade: 'FILHOTE',
      porte: 'PEQUENO',
      nivel_energia: 'ALTA',
      ambiente_ideal: 'FECHADO',
      org_id: org.id,
    } as CreatePetDTO)

    const { pets } = await sut.execute({
      cidade: 'São Paulo',
      filters: { porte: 'PEQUENO', nivel_energia: 'ALTA' },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].nome).toBe('Pipoca')
  })
})
