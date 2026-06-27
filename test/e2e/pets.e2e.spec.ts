import supertest from 'supertest'
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { app } from '@/app'
import { cleanDb } from './helpers/clean-db'

describe('E2E - Pets', () => {
  beforeEach(async () => {
    await app.ready()
    await cleanDb()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a pet with a valid JWT token', async () => {
    const registerResponse = await supertest(app.server)
      .post('/orgs')
      .send({
        nome: 'ONG Teste',
        email: 'teste@teste.com',
        senha: '123456',
        cep: '01001-000',
        endereco: 'Rua Teste, 123',
        whatsapp: '11999999999',
        cidade: 'São Paulo',
      })

    expect(registerResponse.status).toBe(201)

    const authResponse = await supertest(app.server)
      .post('/sessions')
      .send({
        email: 'teste@teste.com',
        senha: '123456',
      })

    const { token } = authResponse.body

    const createPetResponse = await supertest(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Rex',
        descricao: 'Cão amigável',
        idade: 'ADULTO',
        porte: 'GRANDE',
        nivel_energia: 'ALTA',
        ambiente_ideal: 'AMPLO',
      })

    expect(createPetResponse.status).toBe(201)
    expect(createPetResponse.body.pet).toBeDefined()
    expect(createPetResponse.body.pet.nome).toBe('Rex')
  })

  it('should not create a pet without a token', async () => {
    const response = await supertest(app.server)
      .post('/pets')
      .send({
        nome: 'Rex',
        idade: 'ADULTO',
        porte: 'GRANDE',
        nivel_energia: 'ALTA',
        ambiente_ideal: 'AMPLO',
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Unauthorized')
  })

  it('should search pets by city', async () => {
    const registerResponse = await supertest(app.server)
      .post('/orgs')
      .send({
        nome: 'ONG SP',
        email: 'sp@teste.com',
        senha: '123456',
        cep: '01001-000',
        endereco: 'Rua SP, 123',
        whatsapp: '11999999999',
        cidade: 'São Paulo',
      })

    expect(registerResponse.status).toBe(201)

    const authResponse = await supertest(app.server)
      .post('/sessions')
      .send({ email: 'sp@teste.com', senha: '123456' })

    const { token } = authResponse.body

    await supertest(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Rex',
        idade: 'ADULTO',
        porte: 'GRANDE',
        nivel_energia: 'ALTA',
        ambiente_ideal: 'AMPLO',
      })

    const searchResponse = await supertest(app.server)
      .get('/pets')
      .query({ cidade: 'São Paulo' })

    expect(searchResponse.status).toBe(200)
    expect(searchResponse.body.pets).toHaveLength(1)
    expect(searchResponse.body.pets[0].nome).toBe('Rex')
  })

  it('should return empty array when searching in a city with no pets', async () => {
    const searchResponse = await supertest(app.server)
      .get('/pets')
      .query({ cidade: 'Curitiba' })

    expect(searchResponse.status).toBe(200)
    expect(searchResponse.body.pets).toHaveLength(0)
  })
})
