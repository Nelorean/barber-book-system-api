# Roadmap

## Fase 1 - Fundação da API

Objetivo: criar uma base pequena, tipada e fácil de evoluir.

- Inicializar Node.js com TypeScript.
- Configurar NestJS.
- Configurar ESLint e Prettier.
- Adicionar rota `GET /health`.
- Configurar variáveis de ambiente.
- Configurar testes automatizados.
- Configurar Docker para PostgreSQL.
- Entender a estrutura inicial de módulos, controllers e providers.

## Fase 2 - Domínio principal

Objetivo: modelar o negócio da barbearia sem integrações externas.

- Criar autenticação com JWT.
- Criar usuários com papéis `CUSTOMER`, `BARBER` e `ADMIN`.
- Criar cadastro de serviços.
- Criar disponibilidade de barbeiros.
- Criar agendamentos.
- Impedir conflito de horários.
- Permitir cancelamento e remarcação.

## Fase 3 - Qualidade e documentação

Objetivo: deixar o projeto demonstrável para portfólio e entrevistas.

- Documentar endpoints com OpenAPI/Swagger.
- Escrever testes de integração para fluxos principais.
- Adicionar CI com GitHub Actions.
- Completar README com setup local.
- Adicionar exemplos de requests.

## Fase 4 - Frontend

Objetivo: criar uma experiência fullstack simples e funcional.

- Criar app React com Vite.
- Criar login.
- Criar tela de serviços.
- Criar tela de agenda.
- Criar fluxo de criação de agendamento.
- Consumir a API real.

## Fase 5 - Google Calendar

Objetivo: integrar agenda externa sem comprometer a regra de negócio interna.

- Criar conexão OAuth com Google.
- Salvar dados de calendário do barbeiro.
- Sincronizar agendamento confirmado com Google Calendar.
- Atualizar evento ao remarcar.
- Remover ou cancelar evento ao cancelar agendamento.
- Avaliar webhooks do Google Calendar depois do deploy.
