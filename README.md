# Caffe Frontend (Next.js)

Modern cafe menu dashboard built with:

- Next.js App Router + TypeScript
- Tailwind CSS
- Zustand (local UI state)
- React Query (server state)
- React Hook Form + zod validation
- Headless UI + Heroicons

## 1. Install

```bash
pnpm install
```

## 2. Environment

```bash
cp .env.example .env.local
```

Default API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 3. Run

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` - start dev server
- `pnpm build` - production build
- `pnpm start` - run production build
- `pnpm typecheck` - TypeScript check
- `pnpm lint` - linting
- `pnpm gen:types` - regenerate OpenAPI types from `../openapi.yaml`

## Main structure

- `src/app` - routes (App Router)
- `src/components` - reusable UI and feature components
- `src/lib/api.ts` - all API requests
- `src/lib/hooks` - React Query hooks
- `src/lib/stores` - Zustand stores
- `src/lib/openapi.generated.ts` - OpenAPI-derived schema types
