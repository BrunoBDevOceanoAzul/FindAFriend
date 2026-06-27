import type { CreateOrgDTO, Org } from '../../dtos/create-org-dto'
import type { OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  items: Org[] = []

  async create(data: CreateOrgDTO): Promise<Org> {
    const org: Org = {
      id: crypto.randomUUID(),
      nome: data.nome,
      email: data.email,
      password_hash: data.password_hash,
      cep: data.cep,
      endereco: data.endereco,
      whatsapp: data.whatsapp,
      cidade: data.cidade,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(org)
    return org
  }

  async findByEmail(email: string): Promise<Org | null> {
    return this.items.find((org) => org.email === email) ?? null
  }

  async findById(id: string): Promise<Org | null> {
    return this.items.find((org) => org.id === id) ?? null
  }

  async findManyByCity(cidade: string): Promise<Org[]> {
    return this.items.filter((org) => org.cidade === cidade)
  }
}
