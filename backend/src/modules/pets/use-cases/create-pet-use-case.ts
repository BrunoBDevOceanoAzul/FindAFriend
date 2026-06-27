import type { PetsRepository } from '../repositories/pets-repository'
import type { OrgsRepository } from '@/modules/orgs/repositories/orgs-repository'
import { OrgNotFoundError } from '@/shared/errors/org-not-found-error'

interface CreatePetUseCaseRequest {
  nome: string
  descricao?: string | null
  idade: string
  porte: string
  nivel_energia: string
  ambiente_ideal: string
  org_id: string
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute(data: CreatePetUseCaseRequest) {
    const org = await this.orgsRepository.findById(data.org_id)

    if (!org) {
      throw new OrgNotFoundError()
    }

    const pet = await this.petsRepository.create({
      nome: data.nome,
      descricao: data.descricao,
      idade: data.idade,
      porte: data.porte,
      nivel_energia: data.nivel_energia,
      ambiente_ideal: data.ambiente_ideal,
      org_id: data.org_id,
    })

    return { pet }
  }
}
