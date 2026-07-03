# Segfy Front-end

Painel corporativo para gestão de apólices de seguro automóvel. Aplicação Next.js 14 (App Router) consumindo uma API REST tipada, com cadastro completo, monitoramento de vencimentos e controle de status.

> **Avaliando o projeto?** Comece por [docs/APRESENTACAO.md](docs/APRESENTACAO.md): um tour de 5 minutos pelas decisões técnicas, com mapa de onde olhar no código.

## Funcionalidades

- **Dashboard** com KPIs (total, ativas, vencendo, prêmio mensal ativo), distribuição por status e buckets de vencimento. Os dados vêm de um BFF que agrega várias chamadas do backend numa única resposta.
- **Listagem** paginada com busca inteligente (roteia número, placa ou CPF/CNPJ para o filtro certo), filtro por status e ordenação, tudo refletido na URL.
- **Cadastro e edição** com máscara de moeda em tempo real e validação no cliente e no servidor pelo mesmo schema Zod.
- **Ciclo de vida** da apólice: cancelar, expirar e histórico de status, com transições controladas.
- **Vencimentos** em até 30 dias numa visão dedicada.
- **Erros da API traduzidos** para pt-BR e sempre exibidos (inline no formulário ou via toast).
- **Tema claro e escuro** com persistência, e formulários que abrem como modal por cima da lista.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router, RSC + Client Components) |
| Linguagem | TypeScript 5 (`strict`, `noUncheckedIndexedAccess`) |
| UI | Tailwind CSS 3, shadcn/ui, Radix primitives |
| Estado servidor | TanStack Query 5 |
| Agregação | Route Handlers do Next como BFF (dashboard) |
| Formulários | react-hook-form + Zod |
| HTTP | Axios com cliente tipado e mapeamento de erros |
| Gráficos | Recharts 3 |
| Tema | Modo claro e escuro com persistência local |
| Deploy | Vercel |

## Rodando localmente

Pré-requisito: Node.js 20 ou superior e npm.

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

A aplicação sobe em `http://localhost:3000`. Requer o backend Segfy acessível na URL configurada em `SEGFY_API_URL`.

## Scripts

| Comando | Ação |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificação de tipos sem emitir |

## Arquitetura

Três camadas horizontais, do genérico ao específico. A regra de dependência é `app → features → components → lib` (camadas de baixo nunca importam de cima).

```
src/
├── lib/          Infraestrutura pura (http, env, formatação). Sem UI.
├── components/
│   ├── ui/       Primitivos shadcn (button, input, table). Sem regra de negócio.
│   ├── layout/   Shell da aplicação (sidebar, topbar, breadcrumbs).
│   └── shared/   Blocos reutilizáveis (empty-state, kpi-card, pagination).
├── features/
│   ├── policies/ Feature isolada. Agrupa api, schemas, hooks e componentes.
│   └── dashboard/ Agregações e cards do painel.
└── app/          Rotas Next.js + Route Handlers. Páginas compõem features + shared + ui.
    └── api/bff/  Backend-for-frontend: agrega o backend no servidor (dashboard).
```

### Como cada feature se organiza

```
features/policies/
├── api/           Chamadas HTTP tipadas
├── schemas/       Zod schemas (source of truth de validação)
├── types/         Tipos de resposta da API
├── hooks/         useQuery e useMutation (query-keys centralizadas)
├── components/    UI específica do domínio
└── utils/         Formatadores específicos do domínio
```

Trocar de tela reutiliza o mesmo hook, a mesma tabela e o mesmo formulário.

## Rotas

| Rota | Descrição |
|---|---|
| `/dashboard` | KPIs, apólices recentes e vencimentos próximos |
| `/policies` | Lista paginada com busca e filtro por status |
| `/policies/new` | Formulário de cadastro |
| `/policies/[id]` | Detalhes com ações de editar e excluir |
| `/policies/[id]/edit` | Edição com controle de transições de status |
| `/expiring` | Apólices ativas vencendo em até 30 dias |

`/policies/new` e `/policies/[id]/edit` também abrem como modal por cima da lista (intercepting routes via slot `@modal`). Em acesso direto pela URL, renderizam como página cheia.

## Estados de carregamento e erro

Cada rota tem `loading.tsx` com um skeleton que espelha o layout real da página (KPIs no dashboard, toolbar + linhas na lista, campos no formulário), e `error.tsx` como error boundary que preserva sidebar e topbar, com botão de retry e `digest` do erro visível. Dentro das páginas, os fetches do TanStack Query têm seus próprios estados de loading, empty e erro com retry.

## Decisões de projeto

**Duas vias de dados: rewrite e BFF.** Recursos (listas, detalhe, mutations) vão do browser para paths relativos como `/api/segfy/policies`, que o `next.config.mjs` reescreve para `${SEGFY_API_URL}/api/v1/policies` no servidor. Isso elimina CORS e mantém a URL real do backend fora do bundle. Já o dashboard consome um BFF (`/api/bff/dashboard`, em [`src/app/api/bff/dashboard/route.ts`](src/app/api/bff/dashboard/route.ts)) que dispara as chamadas necessárias em paralelo no servidor, calcula buckets e totais e devolve um payload único, evitando cinco requests em cascata no cliente.

**Erros da API traduzidos e sempre visíveis.** O backend responde mensagens em inglês. A camada em [`src/lib/http/error-messages.ts`](src/lib/http/error-messages.ts) mapeia códigos e mensagens (inclusive as parametrizadas, como placa e status) para pt-BR. No formulário, erros de campo aparecem inline e qualquer erro de domínio sem campo associado vira um alerta fixo, garantindo que nada seja engolido silenciosamente.

**Redirect da raiz no nível HTTP.** `/` redireciona para `/dashboard` via `redirects()` no `next.config.mjs`, antes de qualquer render React. Fazer isso com `redirect()` numa página do App Router, junto de um `loading.tsx` global, prendia o primeiro carregamento no spinner.

**Validação no cliente e no servidor com o mesmo schema.** Zod é usado tanto para validar o formulário (`react-hook-form`) quanto para gerar os tipos de input das chamadas HTTP. Erros de validação retornados pela API no formato `details: Record<string, string[]>` são espalhados nos campos do formulário via `form.setError`.

**Query-keys centralizadas.** Toda invalidação passa por `hooks/query-keys.ts`. Mutations invalidam o mínimo necessário.

**Busca roteada por formato do termo.** A API não expõe busca global, apenas filtros por `number`, `licensePlate` e `document`. O front classifica o que o usuário digitou (número de apólice, placa ou CPF/CNPJ) e envia para o filtro correto. Ver `classifySearch` em [`src/features/policies/api/policies-api.ts`](src/features/policies/api/policies-api.ts).

**Filtros na URL.** Busca, status, ordenação e paginação vivem na query string. Qualquer visão da lista é compartilhável por link e sobrevive a refresh.

**Timeout dimensionado para cold start.** O backend no free tier do Render dorme após inatividade e o primeiro request pode levar ~30 s. O timeout do cliente HTTP acomoda esse caso em vez de estourar erro.

**Transições de status controladas.** `Ativa` pode ir para `Cancelada` ou `Expirada`. `Cancelada` e `Expirada` são estados terminais e o próprio formulário desabilita o select nesses casos.

**Sem uso de recursos beta.** React 18 estável, sem `use` hook. Compatível com edge runtime da Vercel.

## Contrato de erro da API

O cliente HTTP em [`src/lib/http/client.ts`](src/lib/http/client.ts) espera o shape padrão do backend:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "requestId": "0HN...",
    "details": { "document": ["Document is invalid."] }
  }
}
```

`requestId` é exibido no `ErrorState` para facilitar suporte. `details` alimenta as mensagens de campo no formulário.

## Deploy no Vercel

O projeto está configurado para deploy direto. O `vercel.json` já fixa a região em `gru1` (São Paulo) para reduzir latência com o backend brasileiro.

### 1. Importar o repositório

1. Acesse [vercel.com/new](https://vercel.com/new) e selecione o repositório.
2. Root Directory: deixe em branco se este projeto estiver na raiz; aponte para a subpasta caso contrário.
3. Build & Output Settings: não altere nada. O Vercel detecta `next build` automaticamente.

### 2. Configurar variáveis de ambiente

Em Project Settings, Environment Variables, defina para Production e Preview:

| Variável | Valor | Observação |
|---|---|---|
| `SEGFY_API_URL` | `https://<seu-backend>.onrender.com` | URL absoluta, sem barra final. Server-only, não vaza no bundle. |
| `NEXT_PUBLIC_API_BASE_URL` | `/api/segfy` | Path relativo. Mantenha esse valor. |

Se `SEGFY_API_URL` não for definida em produção, o build falha com mensagem clara. Isso é intencional para evitar que o deploy suba apontando para `localhost`.

### 3. Deploy

Clique em Deploy. Cada push na branch principal gera um deploy. PRs geram previews automáticos.

### Fluxo de requisição em produção

Recursos (listas, detalhe, mutations) via rewrite:

```
browser -> seu-app.vercel.app/api/segfy/policies
                    |
                    | rewrite no servidor (next.config.mjs)
                    v
          SEGFY_API_URL/api/v1/policies
```

Dashboard via BFF (Route Handler agrega no servidor):

```
browser -> seu-app.vercel.app/api/bff/dashboard
                    |
                    | route handler chama o backend em paralelo e agrega
                    v
          SEGFY_API_URL/api/v1/policies (+ /policies/expiring, filtros)
```

Nos dois casos o browser nunca conhece a URL real do backend, então não há CORS a configurar do lado da API.
