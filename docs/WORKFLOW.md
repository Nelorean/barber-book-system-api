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

Cada commit deve representar uma unidade pequena de raciocínio.

## Tamanho ideal de PR

Um bom PR para treino deve ter:

- Uma mudança principal.
- Uma motivação clara.
- Testes ou verificação manual.
- Pouca mistura entre feature, refactor e formatação.

## Checklist antes de abrir PR

- O escopo está pequeno?
- O nome da branch explica a mudança?
- O PR tem descrição clara?
- O projeto compila?
- Os testes relevantes rodam?
- O README ou Swagger precisa mudar?

## Como o review será feito

O review vai priorizar:

- Bugs e regressão de comportamento.
- Regras de negócio incompletas.
- Tipagem fraca ou validação ausente.
- Testes faltando em pontos de risco.
- Nomes confusos.
- Acoplamento desnecessário.
