# Segfy — Front-end

Painel corporativo para operar apólices de seguro automóvel, consumindo a API descrita em [`../segfy/specs/api-contract.md`](../segfy/specs/api-contract.md).

## Stack

- **Next.js 14** (App Router, Server Components + Client Components)
- **React 18** (sem `use` hook)
- **TypeScript** com `strict` + `noUncheckedIndexedAccess`
- **Tailwind CSS 3** + **shadcn/ui** (New York, sistema de tokens HSL)
- **Zod** para validação (env, schemas de formulário)
- **TanStack Query 5** para estado servidor
- **react-hook-form** para estado de formulário
- **date-fns** para formatação de datas
- **sonner** para toasts

## Como rodar

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Servidor em `http://localhost:3000`. A API precisa estar acessível em `NEXT_PUBLIC_API_BASE_URL`.

## Scripts

| Comando | Ação |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificação de tipos sem emitir |

## Arquitetura de composição

Três camadas horizontais, do genérico ao específico:

```
src/
├── lib/          — infra pura (http, env, formatação). Zero UI.
├── components/
│   ├── ui/       — primitivos shadcn (button, input, table…) — sem regra de negócio
│   ├── layout/   — shell (sidebar, topbar, breadcrumbs) — sem regra de negócio
│   └── shared/   — blocos reutilizáveis (empty-state, kpi-card, pagination)
├── features/
│   └── policies/ — feature isolada; agrupa api + schemas + hooks + componentes
└── app/          — rotas Next.js; páginas compõem features + shared + ui
```

Regra de dependência: **`app → features → components → lib`**. Nenhuma camada de baixo importa de camadas de cima.

### Como uma feature se organiza

```
features/policies/
├── api/           chamadas HTTP tipadas
├── schemas/       Zod schemas (source of truth de validação)
├── types/         tipos de resposta da API
├── hooks/         useQuery + useMutation (query-keys centralizadas)
├── components/    UI específica do domínio
└── utils/         formatadores específicos do domínio
```

Trocar de tela para tela reutiliza o mesmo hook + mesma tabela + mesmo form.

## Rotas

| Rota | Descrição |
|---|---|
| `/dashboard` | KPIs + apólices recentes + vencimentos próximos |
| `/policies` | Lista paginada; filtros via query string (`page`, `pageSize`) |
| `/policies/new` | Formulário de cadastro |
| `/policies/[id]` | Detalhes + ações (editar, excluir) |
| `/policies/[id]/edit` | Formulário de edição (permite mudar status) |
| `/expiring` | Apólices ativas vencendo em ≤ 30 dias |

## Contrato de erro esperado da API

O cliente HTTP em [`src/lib/http/client.ts`](src/lib/http/client.ts) espera o shape padrão do backend:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "…",
    "requestId": "0HN…",
    "details": { "document": ["Document is invalid."] }
  }
}
```

Erros com `details` no formato `Record<string, string[]>` são espalhados nos campos correspondentes do formulário via `form.setError`.

## Mover para outro repositório

A pasta é totalmente self-contained. Para preservar histórico:

```bash
# na raiz do repo atual
git subtree split --prefix=front-end -b front-end-only
# em outro shell, no destino
git clone <novo-repo>
cd <novo-repo>
git pull ../naporta-orders-api front-end-only
```

Alternativa (sem histórico): copiar `front-end/*` para a raiz do novo repo.
