export interface CreateOrgDTO {
  nome: string
  email: string
  password_hash: string
  cep: string
  endereco: string
  whatsapp: string
  cidade: string
  latitude?: number
  longitude?: number
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
  latitude: number | null
  longitude: number | null
  created_at: Date
  updated_at: Date
}
