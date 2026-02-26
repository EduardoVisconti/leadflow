# LeadFlow CRM

CRM built for small sales teams — track deals, contacts, and follow-ups without losing leads.

**[Live Demo](https://leadflow-electronics.vercel.app)** — `duduhsg@gmail.com` / `123456`

---

## Features

- Kanban pipeline with drag-and-drop (Lead → Qualified → Proposal → Negotiation → Closed)
- Deal tracking with origin channel (WhatsApp, Instagram, Referral), product of interest, and priority
- Contact & company database with search and filtering
- Product catalog with stock management
- Task management with due dates and overdue alerts
- Activity feed per deal — log calls, emails, meetings, notes
- AI-powered deal health analysis (Google Gemini)
- Analytics dashboard — pipeline value, conversion funnel, revenue over time
- Dark mode, global search (Ctrl+K), CSV export, mobile responsive

## Stack

Next.js 14 · TypeScript · Supabase (PostgreSQL) · Tailwind CSS · shadcn/ui · TanStack Query · React Hook Form + Zod · @dnd-kit · Recharts · Google Gemini API · Vercel

## Getting Started

```bash
git clone https://github.com/EduardoVisconti/leadflow.git
cd leadflow
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

Run migrations in Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_products_tasks.sql`

```bash
npm run dev
```

## License

MIT
