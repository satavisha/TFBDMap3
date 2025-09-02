### TFBD Map

A global aggregation platform to increase the visibility and reach of dance events worldwide.

- **Website**: [tfbdmap.vercel.app](https://tfbdmap.vercel.app/)
- **Telegram channel**: [t.me/TFBDMap](https://t.me/TFBDMap)

### Features

- **Event aggregation**: Loads events from a CSV source for simple, portable data management.
- **Filtering and search**: Rich filters and a responsive table for exploring events.
- **Modern UI**: Built with Radix UI primitives and Tailwind CSS for accessibility and speed.
- **Dark mode**: Theme toggle with persistence.
- **Client caching**: Uses SWR for snappy client-side data fetching and revalidation.

### Tech stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Radix UI** + shadcn/ui style primitives
- **SWR**, **Zod**, **react-hook-form**
- **PapaParse** (CSV parsing)
- **Recharts** (charts, if applicable)
- **Vercel Analytics**

### Getting started

Prerequisites:
- Node.js 18+ (or 20+ recommended)
- pnpm 9+

Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Build and start production:

```bash
pnpm build
pnpm start
```

Lint (optional):

```bash
pnpm lint
```

### Project structure

```text
app/                 # Next.js App Router pages/layouts
components/          # UI components, filters, tables, hooks
  ├─ events-table.tsx
  ├─ filters.tsx
  ├─ FiltersSidebar.tsx
  ├─ use-events.ts
  └─ event-helpers.ts
lib/                 # Utilities
public/data/events.csv  # Primary data source for events
styles/              # Global styles
```

### Data: `public/data/events.csv`

- The app reads events from `public/data/events.csv` at build/runtime via client parsing.
- To update events, replace or edit this file and redeploy. In dev, changes are picked up on refresh.
- CSV columns should be consistent across rows. If you add columns, ensure the UI parses/uses them appropriately.

### Scripts

- **dev**: `pnpm dev` — start local dev server
- **build**: `pnpm build` — production build
- **start**: `pnpm start` — run production server
- **lint**: `pnpm lint` — run Next.js lint

### Deployment

- Designed for deployment on Vercel. Push to the default branch to trigger deployments, or deploy manually from the Vercel dashboard.

### Feedback & contributions

Got an idea or found an issue? Open an issue/PR, or reach out via the Telegram channel above.
