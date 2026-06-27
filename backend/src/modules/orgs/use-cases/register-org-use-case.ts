import { hash } from 'bcryptjs'
import type { OrgsRepository } from '../repositories/orgs-repository'
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists'

interface RegisterOrgUseCaseRequest {
  nome: string
  email: string
  senha: string
  cep: string
  endereco: string
  whatsapp: string
  cidade: string
  latitude?: number
  longitude?: number
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute(data: RegisterOrgUseCaseRequest) {
    const existingOrg = await this.orgsRepository.findByEmail(data.email)

    if (existingOrg) {
      throw new EmailAlreadyExistsError()
    }

    const password_hash = await hash(data.senha, 6)

    const org = await this.orgsRepository.create({
      nome: data.nome,
      email: data.email,
      password_hash,
      cep: data.cep,
      endereco: data.endereco,
      whatsapp: data.whatsapp,
      cidade: data.cidade,
      latitude: data.latitude,
      longitude: data.longitude,
    })

    return { org }
  }
}
