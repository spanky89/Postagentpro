# PostAgentPro API

Backend API for PostAgentPro - AI-powered social media automation for contractors.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** PostgreSQL (Prisma ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **APIs:** OpenAI, Google My Business, Meta Graph, Pexels

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 3. Set Up Database

Run Prisma migrations:

```bash
npm run prisma:migrate
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

### 4. Start Development Server

```bash
npm run dev
```

API will be running at: `http://localhost:4000`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login existing user

### Protected Routes (Coming Soon)
- `GET /api/user/profile` - Get user profile
- `POST /api/accounts/connect` - Connect social media account
- `GET /api/posts` - Get scheduled posts
- `POST /api/posts/approve` - Approve pending post (Pro/Premium)

## Database Schema

See `/prisma/schema.prisma` for full schema definition.

**Core tables:**
- `users` - User accounts
- `businesses` - Business profiles
- `connected_accounts` - OAuth tokens for social platforms
- `post_queue` - Scheduled and published posts
- `analytics` - Engagement metrics
- `media_library` - Uploaded photos (Pro/Premium)

## Development

### Run Migrations

```bash
npm run prisma:migrate
```

### View Database

```bash
npx prisma studio
```

### Lint/Format

```bash
npm run lint
npm run format
```

## Deployment

**Production:** Deploy to Fly.io (see deployment guide in `/docs`)

**Database:** Fly.io Postgres or Supabase

## Environment Variables

Required variables (see `.env.example` for full list):

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for signing JWTs
- `STRIPE_SECRET_KEY` - Stripe API key
- `OPENAI_API_KEY` - OpenAI API key

## Architecture

```
api/
├── src/
│   ├── index.js          # Express app entry point
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Auth, error handling, etc.
│   └── jobs/             # Background jobs (BullMQ)
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## License

Proprietary - PostAgentPro
