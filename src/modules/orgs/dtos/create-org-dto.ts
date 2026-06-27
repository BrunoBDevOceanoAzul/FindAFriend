export interface CreateOrgDTO {
  nome: string
  email: string
  password_hash: string
  cep: string
  endereco: string
  whatsapp: string
  cidade: string
}

export interface Org {
  id: string
  nome: string
  email: string
  password_hash: string
  cep: string
  endereco: string
  whatsapp: string
  cidade: string
  created_at: Date
  updated_at: Date
}
