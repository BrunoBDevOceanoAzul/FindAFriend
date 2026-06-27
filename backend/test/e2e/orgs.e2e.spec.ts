import supertest from 'supertest'
import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { app } from '@/app'
import { cleanDb } from './helpers/clean-db'

describe('E2E - Orgs', () => {
  beforeEach(async () => {
    await app.ready()
    await cleanDb()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register a new org', async () => {
    const response = await supertest(app.server)
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

    expect(response.status).toBe(201)
  })

  it('should not register with duplicate email', async () => {
    await supertest(app.server)
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

    const response = await supertest(app.server)
      .post('/orgs')
      .send({
        nome: 'ONG Teste 2',
        email: 'teste@teste.com',
        senha: '123456',
        cep: '01001-000',
        endereco: 'Rua Teste, 456',
        whatsapp: '11999999998',
        cidade: 'São Paulo',
      })

    expect(response.status).toBe(409)
    expect(response.body.message).toBe('Email already exists')
  })

  it('should authenticate an org and return a JWT token', async () => {
    await supertest(app.server)
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

    const response = await supertest(app.server)
      .post('/sessions')
      .send({
        email: 'teste@teste.com',
        senha: '123456',
      })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
    expect(typeof response.body.token).toBe('string')
  })

  it('should not authenticate with wrong credentials', async () => {
    const response = await supertest(app.server)
      .post('/sessions')
      .send({
        email: 'wrong@teste.com',
        senha: 'wrongpassword',
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid credentials')
  })
})
