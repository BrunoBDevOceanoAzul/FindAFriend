# FindAFriend

Plataforma para adoção de pets — API REST em Fastify + Prisma (backend) e React + Tailwind v4 (frontend).

## Arquitetura

```
findAFriend/
├── backend/          → API Fastify + Prisma (porta 3334)
│   ├── prisma/        → Schema e migrations
│   ├── src/           → Código-fonte da API
│   └── uploads/       → Imagens enviadas via upload
├── frontend/          → React + Vite + Tailwind v4 (porta 5173)
│   └── src/
│       ├── pages/     → Home, PetProfile, OrgRegister, OrgLogin, Dashboard
│       ├── components/→ Header, Footer
│       ├── services/  → api.ts (Axios instance)
│       └── lib/       → Tipos compartilhados
└── docker-compose.yml → PostgreSQL (porta 5433) + app
```

## Pré-requisitos

- Node.js 18+
- Docker + Docker Compose
- npm

## Setup

```bash
# 1. Instalar dependências
npm install
cd frontend && npm install && cd ..

# 2. Subir banco de dados
docker compose up -d

# 3. Aplicar schema Prisma
npx prisma db push

# 4. Iniciar backend (porta 3334)
npm run dev

# 5. Em outro terminal, iniciar frontend (porta 5173)
cd frontend && npm run dev
```

Acesse:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3334
- **Swagger:** http://localhost:3334/docs

## Endpoints da API

### ORGs (organizações)

| Método | Rota           | Autenticação | Descrição                  |
|--------|----------------|--------------|----------------------------|
| POST   | `/orgs`        | ❌           | Cadastrar ORG              |
| POST   | `/sessions`    | ❌           | Login (retorna JWT)       |
| GET    | `/orgs/:id`    | ❌           | Perfil da ORG              |

### Pets

| Método | Rota              | Autenticação | Descrição                     |
|--------|-------------------|--------------|-------------------------------|
| GET    | `/pets`           | ❌           | Listar pets (query: cidade)   |
| GET    | `/pets/:id`       | ❌           | Detalhes do pet               |
| POST   | `/pets`           | ✅ JWT       | Cadastrar pet                 |
| PATCH  | `/pets/:id`       | ✅ JWT       | Atualizar pet                 |
| DELETE | `/pets/:id`       | ✅ JWT       | Excluir pet                   |
| POST   | `/pets/:id/images`| ✅ JWT       | Upload de imagens (multipart) |

### Filtros de busca

`GET /pets?cidade=São Paulo&porte=pequeno&idade=filhote&nivel_energia=alto`

## Testes

```bash
# Unitários (Vitest)
npm test

# E2E (requer Docker rodando)
npm run test:e2e
```

## Stack

- **Runtime:** Node.js + TypeScript
- **API:** Fastify 4.x
- **ORM:** Prisma
- **Banco:** PostgreSQL 15
- **Auth:** JWT (`@fastify/jwt` v8)
- **Upload:** `@fastify/multipart`
- **Frontend:** React 19 + Vite + Tailwind v4
- **Mapa:** Leaflet + OpenStreetMap
- **Testes:** Vitest
