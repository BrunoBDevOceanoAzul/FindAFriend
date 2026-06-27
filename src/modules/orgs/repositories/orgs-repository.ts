import type { CreateOrgDTO, Org } from '../dtos/create-org-dto'

export interface OrgsRepository {
  create(data: CreateOrgDTO): Promise<Org>
  findByEmail(email: string): Promise<Org | null>
  findById(id: string): Promise<Org | null>
  findManyByCity(cidade: string): Promise<Org[]>
}
