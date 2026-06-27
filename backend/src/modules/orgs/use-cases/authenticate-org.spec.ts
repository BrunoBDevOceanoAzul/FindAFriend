import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { AuthenticateOrgUseCase } from './authenticate-org-use-case'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateOrgUseCase

describe('AuthenticateOrgUseCase', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateOrgUseCase(orgsRepository)

    await orgsRepository.create({
      nome: 'ONG Teste',
      email: 'teste@teste.com',
      password_hash: await hash('123456', 6),
      cep: '01001-000',
      endereco: 'Rua Teste, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    })
  })

  it('should authenticate with valid credentials', async () => {
    const { org } = await sut.execute({
      email: 'teste@teste.com',
      senha: '123456',
    })

    expect(org.email).toBe('teste@teste.com')
    expect(org.nome).toBe('ONG Teste')
  })

  it('should not authenticate with wrong email', async () => {
    await expect(
      sut.execute({ email: 'wrong@teste.com', senha: '123456' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate with wrong password', async () => {
    await expect(
      sut.execute({ email: 'teste@teste.com', senha: 'wrong' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
