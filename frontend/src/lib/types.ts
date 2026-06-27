export interface Org {
  id: string
  nome: string
  email: string
  cep: string
  endereco: string
  whatsapp: string
  cidade: string
  latitude: number | null
  longitude: number | null
}

export interface Pet {
  id: string
  nome: string
  descricao: string | null
  idade: string
  porte: string
  nivel_energia: string
  ambiente_ideal: string
  imagens: string[]
  org_id: string
  created_at: string
  updated_at: string
}

export interface CreatePetData {
  nome: string
  descricao?: string | null
  idade: string
  porte: string
  nivel_energia: string
  ambiente_ideal: string
}

export interface RegisterOrgData {
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

export interface LoginData {
  email: string
  senha: string
}
