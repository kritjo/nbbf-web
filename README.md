Website for Norges Bondebridgeforbund - a card game federation

## Stack
- Next (with server actions)
- React (with new dom features, eg. useFormState and useTransition)
- Tailwind
- Tanstack Query, with SSR prefetching
- Drizzle ORM
- Shadcn/ui components


## Getting Started

First, run the development server:

```bash
pnpm install
vercel dev
```

Or for automatic env config, use `vercel` cli.

## To make migrations
```bash
pnpm makemigrations
pnpm migrate
```

You should probably do `vercel pull` first
