# Workflow de Pull Requests

## Branches

Use nomes pequenos e objetivos:

- `docs/project-workflow`
- `chore/init-api`
- `feat/health-check`
- `feat/auth-register`
- `fix/appointment-conflict`

## Commits

Use Conventional Commits:

- `docs: add project workflow`
- `chore: initialize typescript api`
- `feat: add health check route`
- `test: cover appointment conflict`
- `fix: prevent overlapping appointments`

Cada commit deve representar uma unidade pequena de raciocinio.

## Tamanho ideal de PR

Um bom PR para treino deve ter:

- Uma mudanca principal.
- Uma motivacao clara.
- Testes ou verificacao manual.
- Pouca mistura entre feature, refactor e formatacao.

## Checklist antes de abrir PR

- O escopo esta pequeno?
- O nome da branch explica a mudanca?
- O PR tem descricao clara?
- O projeto compila?
- Os testes relevantes rodam?
- O README ou Swagger precisa mudar?

## Como o review sera feito

O review vai priorizar:

- Bugs e regressao de comportamento.
- Regras de negocio incompletas.
- Tipagem fraca ou validacao ausente.
- Testes faltando em pontos de risco.
- Nomes confusos.
- Acoplamento desnecessário.

