import { compare } from 'bcryptjs'
import type { OrgsRepository } from '../repositories/orgs-repository'
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error'

interface AuthenticateOrgUseCaseRequest {
  email: string
  senha: string
}

export class AuthenticateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute(data: AuthenticateOrgUseCaseRequest) {
    const org = await this.orgsRepository.findByEmail(data.email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const isPasswordValid = await compare(data.senha, org.password_hash)

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    return { org }
  }
}
