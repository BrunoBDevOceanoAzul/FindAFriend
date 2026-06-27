export interface CreatePetDTO {
  nome: string
  descricao?: string | null
  idade: string
  porte: string
  nivel_energia: string
  ambiente_ideal: string
  org_id: string
}

export interface Pet {
  id: string
  nome: string
  descricao: string | null
  idade: string
  porte: string
  nivel_energia: string
  ambiente_ideal: string
  org_id: string
  created_at: Date
  updated_at: Date
}
