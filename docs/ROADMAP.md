# Roadmap

## Fase 1 - Fundacao da API

Objetivo: criar uma base pequena, tipada e facil de evoluir.

- Inicializar Node.js com TypeScript.
- Configurar Fastify.
- Adicionar rota `GET /health`.
- Configurar variaveis de ambiente.
- Configurar testes automatizados.
- Configurar Docker para PostgreSQL.

## Fase 2 - Dominio principal

Objetivo: modelar o negocio da barbearia sem integracoes externas.

- Criar autenticacao com JWT.
- Criar usuarios com papeis `CUSTOMER`, `BARBER` e `ADMIN`.
- Criar cadastro de servicos.
- Criar disponibilidade de barbeiros.
- Criar agendamentos.
- Impedir conflito de horarios.
- Permitir cancelamento e remarcacao.

## Fase 3 - Qualidade e documentacao

Objetivo: deixar o projeto demonstravel para portfolio e entrevistas.

- Documentar endpoints com OpenAPI/Swagger.
- Escrever testes de integracao para fluxos principais.
- Adicionar CI com GitHub Actions.
- Completar README com setup local.
- Adicionar exemplos de requests.

## Fase 4 - Frontend

Objetivo: criar uma experiencia fullstack simples e funcional.

- Criar app React com Vite.
- Criar login.
- Criar tela de servicos.
- Criar tela de agenda.
- Criar fluxo de criacao de agendamento.
- Consumir a API real.

## Fase 5 - Google Calendar

Objetivo: integrar agenda externa sem comprometer a regra de negocio interna.

- Criar conexao OAuth com Google.
- Salvar dados de calendario do barbeiro.
- Sincronizar agendamento confirmado com Google Calendar.
- Atualizar evento ao remarcar.
- Remover ou cancelar evento ao cancelar agendamento.
- Avaliar webhooks do Google Calendar depois do deploy.
