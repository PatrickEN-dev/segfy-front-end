# Sobre este front-end

> Documento pensado para quem vai avaliar o projeto (recrutadores e revisores técnicos). Em 5 minutos de leitura você entende o que foi construído, as decisões tomadas e onde olhar no código.

## O que é

Painel corporativo para gestão de apólices de seguro automóvel: dashboard com indicadores, cadastro completo (criar, editar, excluir), monitoramento de vencimentos e controle de transições de status. Consome uma API REST em .NET hospedada no Render.

**Stack:** Next.js 14 (App Router) · TypeScript strict · Tailwind CSS + shadcn/ui · TanStack Query · react-hook-form + Zod.

## Por que este projeto demonstra senioridade

### 1. Arquitetura com regra de dependência explícita

O código é dividido em camadas horizontais (`lib → components → features → app`) onde camadas de baixo nunca importam de cima. Cada feature (`features/policies`, `features/dashboard`) agrupa API, schemas, hooks e componentes do domínio. O resultado prático: a tabela de apólices, o formulário e os hooks são reutilizados em quatro telas diferentes sem duplicação.

### 2. TypeScript levado a sério

`strict` e `noUncheckedIndexedAccess` ligados. Todas as respostas da API são tipadas, os schemas Zod são a fonte única de validação e geram os tipos de input das mutations. Não há `any` no código de produção.

### 3. Tratamento de erro em profundidade, não só o caminho feliz

- O cliente HTTP ([src/lib/http/client.ts](../src/lib/http/client.ts)) converte o contrato de erro do backend em uma classe `ApiError` com código, mensagem e `requestId`.
- Erros de validação retornados pela API (`details: Record<string, string[]>`) são espalhados campo a campo no formulário via `form.setError`, então o usuário vê o erro no input certo, não num toast genérico.
- Cada rota tem `error.tsx` (error boundary que preserva a navegação) e estados de erro inline com botão de retry e `requestId` visível para suporte.
- Cada rota tem `loading.tsx` com skeleton que espelha o layout real da página, evitando layout shift.

### 4. UX além do básico

- **Busca inteligente:** a API não tem busca global, só filtros por campo. O front classifica o termo digitado (número de apólice, placa ou CPF/CNPJ) e roteia para o filtro certo ([src/features/policies/api/policies-api.ts](../src/features/policies/api/policies-api.ts)).
- **Filtros na URL:** busca, status, ordenação e página vivem na query string. Qualquer visão da lista é compartilhável por link e sobrevive a refresh.
- **Rotas interceptadas:** criar e editar apólice abrem em modal por cima da lista (parallel routes + intercepting routes do App Router), mas as mesmas URLs funcionam como página cheia em acesso direto.
- **Detalhes de percepção:** contadores animados nos KPIs (com respeito a `prefers-reduced-motion`), skeletons, transições de opacidade em refetch, tema claro/escuro sem flash de hidratação.
- **Resiliência a cold start:** o backend no free tier do Render dorme; o timeout do HTTP client acomoda o primeiro request lento em vez de estourar erro para o usuário.

### 5. Acessibilidade

Landmarks e `aria-label` em seções, `role="alert"` em estados de erro, foco visível em elementos interativos, contraste validado nas cores de gráfico (>= 3:1, com separação para daltonismo), animações desligadas para quem prefere movimento reduzido.

### 6. Segurança e deploy

O browser nunca conhece a URL real do backend: rewrites do Next.js fazem proxy de `/api/segfy/*` para a API no servidor. Isso elimina CORS e mantém a infraestrutura fora do bundle. O build falha de propósito se a variável de ambiente do backend não estiver definida em produção, impedindo deploy quebrado. Deploy contínuo na Vercel, região `gru1` (São Paulo) para latência baixa com o backend brasileiro.

## Mapa do código (onde olhar primeiro)

| Quero ver... | Arquivo |
|---|---|
| Camada HTTP e tratamento de erros | [src/lib/http/client.ts](../src/lib/http/client.ts) |
| Classificação da busca por formato do termo | [src/features/policies/api/policies-api.ts](../src/features/policies/api/policies-api.ts) |
| Formulário com validação dupla (client + server) | [src/features/policies/components/policy-form.tsx](../src/features/policies/components/policy-form.tsx) |
| Lista com filtros sincronizados na URL | [src/app/(app)/policies/page.tsx](../src/app/(app)/policies/page.tsx) |
| Dashboard com agregação de queries | [src/features/dashboard/hooks/use-dashboard-summary.ts](../src/features/dashboard/hooks/use-dashboard-summary.ts) |
| Modais por rota interceptada | [src/app/(app)/@modal](../src/app/(app)/@modal) |
| Tema sem flash de hidratação | [src/components/theme/theme-provider.tsx](../src/components/theme/theme-provider.tsx) |

## Como rodar

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Detalhes de configuração e deploy estão no [README](../README.md).
