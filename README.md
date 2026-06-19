# Barber Booking System API

API para um sistema de agendamentos de barbearia.

## Objetivo

Construir uma API backend/fullstack com TypeScript, PostgreSQL, Prisma, Docker, testes e documentação, evoluindo boas práticas de arquitetura, Git, Pull Requests e code review.

## Stack planejada

- Node.js 24 LTS
- TypeScript
- NestJS
- PostgreSQL
- Prisma
- Docker
- JWT
- Zod
- ESLint
- Prettier
- Testes automatizados
- Swagger/OpenAPI

## Setup local

Instale as dependências:

```bash
npm install
```

Copie o arquivo de ambiente:

```powershell
Copy-Item .env.example .env
```

Nesta etapa, as ferramentas e bibliotecas base já estão instaladas. A API ainda será criada passo a passo nas próximas etapas.

Quando a primeira estrutura NestJS for criada, a API poderá rodar com:

```bash
npm run start:dev
```

## Scripts

- `npm run build`: compila o projeto TypeScript quando houver código em `src`.
- `npm run lint`: executa ESLint.
- `npm run format`: formata arquivos com Prettier.
- `npm run format:check`: verifica formatação sem alterar arquivos.
- `npm test`: executa testes unitários quando existirem testes.
- `npm run test:e2e`: executa testes de integração/e2e quando existirem testes.

## Roadmap inicial

- Setup TypeScript da API
- Health check
- Docker com PostgreSQL
- Prisma schema inicial
- Autenticação
- Serviços da barbearia
- Disponibilidade de barbeiros
- Agendamentos
- Integração futura com Google Calendar
