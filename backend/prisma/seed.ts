import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  const org = await prisma.org.create({
    data: {
      nome: 'ONG Amor Animal',
      email: 'contato@amoranimal.com',
      password_hash: await hash('123456', 6),
      cep: '01001-000',
      endereco: 'Rua dos Animais, 123',
      whatsapp: '11999999999',
      cidade: 'São Paulo',
    },
  })

  await prisma.pet.createMany({
    data: [
      {
        nome: 'Rex',
        descricao: 'Cão amigável e brincalhão',
        idade: 'adulto',
        porte: 'grande',
        nivel_energia: 'alto',
        ambiente_ideal: 'casa_com_quintal',
        org_id: org.id,
      },
      {
        nome: 'Mimi',
        descricao: 'Gata calma e carinhosa',
        idade: 'filhote',
        porte: 'pequeno',
        nivel_energia: 'baixo',
        ambiente_ideal: 'apartamento',
        org_id: org.id,
      },
      {
        nome: 'Thor',
        descricao: 'Cão protetor e leal',
        idade: 'adulto',
        porte: 'medio',
        nivel_energia: 'medio',
        ambiente_ideal: 'casa_com_quintal',
        org_id: org.id,
      },
    ],
  })

  console.log('✅ Seed concluído!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
