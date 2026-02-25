# LeadFlow CRM

A lightweight CRM for small sales teams who need more than a spreadsheet
but less than Salesforce.

Built to solve a real problem: most small teams lose deals because follow-ups
fall through the cracks. LeadFlow gives them a visual pipeline, a clean
contact database, and an AI assistant that surfaces what needs attention today.

## Features

- **Visual Kanban Pipeline** - Drag-and-drop deal management across customizable stages
- **Contact & Company Database** - Full CRUD with search, filtering, and linked relationships
- **Activity Feed** - Log calls, emails, meetings, notes, and tasks on each deal
- **AI-Powered Deal Analysis** - Google Gemini analyzes deal health and suggests next actions
- **Analytics Dashboard** - Pipeline charts, conversion funnel, revenue trends
- **Dark Mode** - Full dark/light theme support
- **Global Search** - Spotlight-style search across deals, contacts, and companies (Ctrl+K)
- **Export** - Download contacts as CSV
- **Mobile Responsive** - Works on all screen sizes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| State | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Drag & Drop | @dnd-kit |
| AI | Google Gemini API (gemini-1.5-flash) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (for AI features)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/leadflow.git
cd leadflow
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the SQL migration in your Supabase dashboard:

Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it in the Supabase SQL Editor.

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
leadflow/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (dashboard)/     # All authenticated pages
│   │   ├── dashboard/   # Metrics overview
│   │   ├── pipeline/    # Kanban board
│   │   ├── deals/       # Deals list & detail
│   │   ├── contacts/    # Contacts list & detail
│   │   ├── companies/   # Companies list & detail
│   │   ├── reports/     # Analytics charts
│   │   └── settings/    # User preferences
│   └── api/ai/          # Gemini API route
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Sidebar, TopBar, Search
│   ├── pipeline/        # Kanban components
│   ├── deals/           # Deal detail, Activity feed, AI card
│   ├── contacts/        # Contact table & modal
│   ├── companies/       # Company modal
│   ├── dashboard/       # Metric cards
│   └── reports/         # Chart components
├── lib/
│   ├── supabase/        # Supabase clients & types
│   ├── hooks/           # React Query hooks
│   ├── validations/     # Zod schemas
│   ├── utils/           # Helpers (currency, date, export)
│   └── constants/       # Pipeline stage config
└── types/               # Global TypeScript types
```

## License

MIT
