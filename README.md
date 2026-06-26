# FindAFriend API

API REST para adoção de pets construída com Node.js, TypeScript, Fastify, Prisma e PostgreSQL.

## Tecnologias

- **Node.js** + **TypeScript**
- **Fastify** - Framework web rápido e leve
- **Prisma** - ORM moderno para PostgreSQL
- **Zod** - Validação de schemas em runtime
- **Vitest** - Testes unitários e de integração

## Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

## Setup Inicial

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e configure suas credenciais do banco:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com sua connection string do PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/findafriend?schema=public"
PORT=3333
NODE_ENV=development
```

### 3. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 4. Rodar Migrations

Para desenvolvimento (cria o banco e aplica migrations):

```bash
npm run prisma:migrate
```

Para produção (aplica migrations pendentes):

```bash
npm run prisma:deploy
```

### 5. (Opcional) Abrir Prisma Studio

Interface visual para gerenciar dados:

```bash
npm run prisma:studio
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor em modo desenvolvimento com hot reload |
| `npm run build` | Compila TypeScript para JavaScript na pasta `dist/` |
| `npm start` | Inicia servidor em produção |
| `npm test` | Executa testes com Vitest |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Executa testes com relatório de cobertura |
| `npm run prisma:generate` | Gera Prisma Client |
| `npm run prisma:migrate` | Cria e aplica migrations (dev) |
| `npm run prisma:deploy` | Aplica migrations (produção) |
| `npm run prisma:studio` | Abre Prisma Studio |

## Estrutura do Projeto

```
src/
├── @types/          # Declarações de tipos globais
├── config/          # Configurações (env, swagger, etc)
├── modules/         # Módulos da aplicação (orgs, pets)
│   └── <module>/
│       ├── dtos/    # Data Transfer Objects (Zod schemas)
│       ├── repositories/  # Prisma repositories
│       ├── services/      # Regras de negócio
│       └── routes.ts      # Rotas Fastify
├── shared/          # Código compartilhado (erros, helpers)
├── app.ts           # Configuração do Fastify
└── server.ts        # Entry point
```

## Models do Banco

### Org
- `id` (UUID) - Identificador único
- `nome` (String) - Nome da organização
- `email` (String, unique) - Email para login
- `password_hash` (String) - Hash da senha
- `cep` (String) - CEP
- `endereco` (String) - Endereço completo
- `whatsapp` (String) - Telefone WhatsApp
- `cidade` (String) - Cidade
- `created_at` / `updated_at` - Timestamps

### Pet
- `id` (UUID) - Identificador único
- `nome` (String) - Nome do pet
- `descricao` (String?) - Descrição opcional
- `idade` (String) - Idade (ex: "filhote", "adulto", "idoso")
- `porte` (String) - Porte (ex: "pequeno", "medio", "grande")
- `nivel_energia` (String) - Nível de energia (ex: "baixo", "medio", "alto")
- `ambiente_ideal` (String) - Ambiente ideal (ex: "apartamento", "casa_com_quintal")
- `org_id` (UUID) - Foreign key para Org
- `created_at` / `updated_at` - Timestamps

## Desenvolvimento

### Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`

Documentação Swagger em `http://localhost:3333/docs`

## Testes

```bash
# Executar todos os testes
npm test

# Executar com coverage
npm run test:coverage
```

## Deploy

### Build de produção

```bash
npm run build
```

### Iniciar em produção

```bash
npm start
```

Certifique-se de rodar as migrations em produção:

```bash
npm run prisma:deploy
```