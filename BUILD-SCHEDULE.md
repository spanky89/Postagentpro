# PostAgentPro - Build Schedule (15-Min Blocks)

**Project:** AI Social Media Autoposter  
**Domain:** postagentpro.com  
**Start Date:** February 24, 2026  
**Target:** MVP in 6 weeks (Starter tier only)

---

## TODAY - Phase 0: Foundation Setup (2 hours total)

### Block 1: 10:45 AM - 11:00 AM ✅
**Task:** Project structure + initial files  
**Deliverables:**
- [ ] Create `/postagentpro` folder structure
- [ ] Create `/api`, `/web`, `/docs` subfolders
- [ ] Initialize git repo
- [ ] Create README.md with project overview

---

### Block 2: 11:00 AM - 11:15 AM
**Task:** Database schema design  
**Deliverables:**
- [ ] Create `DATABASE-SCHEMA.md`
- [ ] Define core tables: users, connected_accounts, businesses
- [ ] Define post_queue, analytics, media_library tables
- [ ] Document relationships and indexes

---

### Block 3: 11:15 AM - 11:30 AM
**Task:** Landing page copy (part 1)  
**Deliverables:**
- [ ] Write hero headline + subheadline
- [ ] Write 3-benefit value props
- [ ] Write "How It Works" 3-step flow
- [ ] Draft pricing table copy

---

### Block 4: 11:30 AM - 11:45 AM
**Task:** Landing page copy (part 2)  
**Deliverables:**
- [ ] Write FAQ (5-7 questions)
- [ ] Write CTA copy
- [ ] Write footer content
- [ ] Create `LANDING-PAGE-COPY.md`

---

### Block 5: 11:45 AM - 12:00 PM
**Task:** Platform registration guides  
**Deliverables:**
- [ ] Write Google Cloud Console setup guide
- [ ] Write Meta Developer setup guide
- [ ] Write OpenAI API key guide
- [ ] Create `PLATFORM-SETUP-GUIDES.md`

---

### Block 6: 12:00 PM - 12:15 PM
**Task:** Infrastructure planning  
**Deliverables:**
- [ ] Document Fly.io setup steps
- [ ] Document domain DNS configuration
- [ ] Create `.env.example` with all required variables
- [ ] Create `DEPLOYMENT-GUIDE.md`

---

### Block 7: 12:15 PM - 12:30 PM
**Task:** Tech stack finalization  
**Deliverables:**
- [ ] Create `package.json` for API (dependencies list)
- [ ] Create `package.json` for web (Next.js + deps)
- [ ] Document API routes structure
- [ ] Create `TECH-STACK.md`

---

### Block 8: 12:30 PM - 12:45 PM
**Task:** Landing page wireframe  
**Deliverables:**
- [ ] Sketch layout structure (sections)
- [ ] Define color palette (primary, secondary, neutrals)
- [ ] List component needs (Hero, Features, Pricing, FAQ)
- [ ] Create `DESIGN-SYSTEM.md`

---

## AFTERNOON - Phase 1: Coding Prep (4 blocks = 1 hour)

### Block 9: 1:00 PM - 1:15 PM
**Task:** API architecture planning  
**Deliverables:**
- [ ] Define all API endpoints (auth, OAuth, posts, analytics)
- [ ] Document request/response schemas
- [ ] Plan middleware (auth, rate limiting, error handling)
- [ ] Create `API-SPEC.md`

---

### Block 10: 1:15 PM - 1:30 PM
**Task:** OAuth flow documentation  
**Deliverables:**
- [ ] Google OAuth flow diagram (callback URLs, scopes)
- [ ] Meta OAuth flow diagram
- [ ] Token storage/refresh logic
- [ ] Create `OAUTH-FLOWS.md`

---

### Block 11: 1:30 PM - 1:45 PM
**Task:** Job queue design  
**Deliverables:**
- [ ] Define job types (generate_content, publish_post, fetch_analytics)
- [ ] Document queue priorities and retry logic
- [ ] Plan cron schedule (when jobs run)
- [ ] Create `JOB-QUEUE-SPEC.md`

---

### Block 12: 1:45 PM - 2:00 PM
**Task:** Content generation prompts  
**Deliverables:**
- [ ] Write base prompt template (with variables)
- [ ] Write 5 theme-specific prompt variations
- [ ] Define photo search queries for each business type
- [ ] Create `AI-PROMPTS.md`

---

## TOMORROW - Phase 2: Build Start

### Morning Session (4 hours)
- Spawn coding agent in isolated directory
- Agent scaffolds API (Express + Prisma + PostgreSQL)
- Agent scaffolds web (Next.js + Tailwind + shadcn/ui)
- Review code, test locally

### Afternoon Session (3 hours)
- Agent builds authentication (signup, login, JWT)
- Agent builds Stripe integration (subscriptions)
- Build landing page (I'll handle design/copy)
- Deploy to Fly.io staging

---

## Week 1 Goals (Feb 24-Mar 2)
- [ ] Working landing page live at postagentpro.com
- [ ] User signup/login flow functional
- [ ] Stripe subscription checkout working
- [ ] Database schema deployed
- [ ] Project scaffolding complete

---

## Next Phases (Weeks 2-6)

**Week 2:** OAuth flows (Google + Meta)  
**Week 3:** Content generation (OpenAI + Pexels integration)  
**Week 4:** Post queue + scheduling (BullMQ)  
**Week 5:** Analytics + reporting  
**Week 6:** Testing + beta launch (50 users)

---

## Notes
- Each block is focused, no multitasking
- If a block runs over, note it and adjust next block
- Deliverables must be checked off before moving on
- Take 5-min break between every 4 blocks
