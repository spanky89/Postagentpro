# PostAgentPro

**AI-powered social media automation for contractors**

**Domain:** postagentpro.com  
**Status:** 🚧 In Development  
**Target Launch:** Week 10 (Beta) | Week 12 (Full Launch)

---

## What We're Building

Fully automated social media posting service for contractors (plumbers, electricians, roofers, etc.). AI generates and publishes 3 posts per week to Google Business Profile and Facebook.

**Key Value Prop:** 5-minute setup, zero ongoing effort, $10/month.

---

## Project Structure

```
postagentpro/
├── api/              # Node.js + Express backend
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── services/ # Business logic (OAuth, content gen, posting)
│   │   ├── jobs/     # BullMQ job definitions
│   │   └── db/       # Prisma schema + migrations
│   └── package.json
│
├── web/              # Next.js frontend (landing + dashboard)
│   ├── app/          # Next.js 14 app router
│   │   ├── page.tsx  # Landing page
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── signup/
│   ├── components/   # React components
│   └── package.json
│
└── docs/             # Specs, schemas, guides
    ├── DATABASE-SCHEMA.md
    ├── LANDING-PAGE-COPY.md
    ├── API-ENDPOINTS.md (coming)
    └── DEPLOYMENT.md (coming)
```

---

## Tech Stack

### Backend
- **Runtime:** Node.js v20+
- **Framework:** Express.js
- **Database:** PostgreSQL 15 (Fly.io Postgres)
- **ORM:** Prisma
- **Job Queue:** BullMQ (Redis-backed)
- **APIs:** OpenAI (GPT-4o-mini), Google My Business, Meta Graph, Pexels

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Auth:** JWT + HTTP-only cookies

### Infrastructure
- **Hosting:** Fly.io (API + DB)
- **Redis:** Upstash (serverless, pay-per-request)
- **Storage:** Cloudflare R2 (photos)
- **CDN:** Cloudflare
- **Payments:** Stripe (subscriptions)

---

## Development Phases

### ✅ Phase 0: Planning (Complete)
- [x] Product spec written
- [x] Database schema designed
- [x] Landing page copy drafted
- [x] Domain secured (postagentpro.com)

### 🚧 Phase 1: Foundation (Week 1-2)
- [ ] Scaffold Node.js API (Express + Prisma)
- [ ] Set up PostgreSQL + run migrations
- [ ] Stripe integration (subscriptions + webhooks)
- [ ] Build landing page (Next.js + Tailwind)
- [ ] Deploy staging environment (Fly.io)

### 📋 Phase 2: OAuth & API Integration (Week 3-4)
- [ ] Google My Business OAuth flow
- [ ] Meta (Facebook) OAuth flow
- [ ] Test posting to sandbox accounts
- [ ] Token refresh logic

### 📋 Phase 3: Content Generation (Week 5-6)
- [ ] OpenAI API integration (GPT-4o-mini)
- [ ] Prompt templates for business types
- [ ] Pexels API integration + caching
- [ ] Post queue system (BullMQ)

### 📋 Phase 4: Scheduling & Publishing (Week 7)
- [ ] Cron jobs for automated posting (3x/week)
- [ ] Optimal time selection algorithm
- [ ] Error handling + retries
- [ ] Webhook listeners (Meta platform updates)

### 📋 Phase 5: Analytics & Reporting (Week 8)
- [ ] Fetch engagement data from APIs
- [ ] Store analytics in database
- [ ] Monthly email template (Resend)
- [ ] Cron job for monthly reports

### 📋 Phase 6: Testing & Polish (Week 9)
- [ ] End-to-end testing (signup → published post)
- [ ] Load testing (simulate 100 users)
- [ ] UI/UX refinements
- [ ] Help docs + FAQ

### 📋 Phase 7: Beta Launch (Week 10)
- [ ] Deploy to production
- [ ] Submit app review to Google + Meta
- [ ] Soft launch to 50 beta users
- [ ] Monitor for issues, gather feedback

### 📋 Phase 8: Full Launch (Week 11-12)
- [ ] Fix bugs from beta
- [ ] Email campaign to 7,744 contractor leads
- [ ] Monitor signups + support requests
- [ ] Plan Pro tier features

---

## Quick Start (Development)

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis (or Upstash account)
- OpenAI API key
- Google Cloud Console project (for My Business API)
- Meta Developer account

### Setup

```bash
# Clone / navigate to project
cd postagentpro

# API setup
cd api
npm install
cp .env.example .env
# Edit .env with your API keys
npx prisma migrate dev
npm run dev

# Web setup (separate terminal)
cd ../web
npm install
cp .env.example .env.local
npm run dev
```

**URLs:**
- Landing page: http://localhost:3000
- API: http://localhost:4000

---

## Environment Variables

### API (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/postagentpro
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
META_APP_ID=...
META_APP_SECRET=...
PEXELS_API_KEY=...
JWT_SECRET=...
```

### Web (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Deployment

### Staging
- API: postagentpro-api-staging.fly.dev
- Web: postagentpro-staging.vercel.app

### Production
- API: api.postagentpro.com (Fly.io)
- Web: postagentpro.com (Vercel or Fly.io)

**See docs/DEPLOYMENT.md for step-by-step guides** (coming soon)

---

## Key Files

- `docs/DATABASE-SCHEMA.md` - Complete database design
- `docs/LANDING-PAGE-COPY.md` - Marketing copy for landing page
- `docs/AI-Social-Media-Autoposter-Spec.md` - Full product specification
- `api/prisma/schema.prisma` - Prisma schema (coming)
- `web/app/page.tsx` - Landing page component (coming)

---

## Contributing

**Current team:** Solo (Spanky + Milo)  
**Development mode:** Agile/iterative, ship fast

---

## License

Proprietary. Not open source.

---

**Status:** Foundation in progress. Week 1 goals: API scaffold + landing page live.
