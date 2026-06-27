import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { RegisterOrgUseCase } from './register-org-use-case'
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('RegisterOrgUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should register a new org', async () => {
    const { org } = await sut.execute({
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      senha: '123456',
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })

    expect(org.id).toBeDefined()
    expect(org.email).toBe('teste@teste.com')
    expect(org.nome).toBe('ONG Teste')
  })

  it('should not register with duplicate email', async () => {
    const data = {
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      senha: '123456',
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    }

    await sut.execute(data)

    await expect(sut.execute(data)).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should hash the password', async () => {
    const { org } = await sut.execute({
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      senha: '123456',
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })

    const isHashed = await hash('123456', 6)
    expect(org.password_hash).not.toBe('123456')
    expect(org.password_hash).toBeDefined()
  })
})
