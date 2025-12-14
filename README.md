# Lager 21

Example e-commerce store built with Next.js 16, React 19, and TypeScript.

## Quick Start

```bash
npm install
npm run dev        # Development server at localhost:3000
```

## Scripts

| Command            | Description                |
| ------------------ | -------------------------- |
| `npm run dev`      | Start dev server           |
| `npm run build`    | Production build           |
| `npm test`         | Run unit tests (Vitest)    |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run typespec` | Compile API schema         |

## Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, DaisyUI 5, Tailwind CSS 4
- **Testing**: Vitest + Testing Library, Playwright
- **API Docs**: TypeSpec → OpenAPI

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── api/products/       # REST API
│   ├── checkout/           # Cart checkout
│   └── product/[id]/       # Product detail
├── components/             # UI components
├── data/                   # Data layer & types
└── store/                  # Cart state
e2e/                        # Playwright tests
typespec/                   # API schema
```

## API

| Endpoint                           | Description            |
| ---------------------------------- | ---------------------- |
| `GET /api/products`                | List products          |
| `GET /api/products?available=true` | Filter by availability |
| `GET /api/products/[id]`           | Get single product     |

Generated OpenAPI spec: `tsp-output/@typespec/openapi3/openapi.yaml`

## Testing

```bash
npm test              # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
```

## Deployment

Optimized for Vercel. Push to deploy.

```bash
npm run build         # Generates .next/
```
