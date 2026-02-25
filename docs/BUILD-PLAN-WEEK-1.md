# PostAgentPro - Week 1 Build Plan
**Target:** Foundation + Landing Page Live  
**Timeline:** 7 days  
**Goal:** Functional landing page + API scaffolding + platform registration

---

## Day 1: Project Setup & Landing Page (Today - Feb 24)

### Morning (2-3 hours)
- [x] Create project structure (api, web, docs folders)
- [x] Database schema designed
- [x] Landing page copy written
- [ ] Initialize Next.js project (web/)
- [ ] Initialize Node.js project (api/)
- [ ] Set up Tailwind CSS + shadcn/ui

### Afternoon (2-3 hours)
- [ ] Build landing page hero section
- [ ] Build problem/solution sections
- [ ] Build pricing cards
- [ ] Build FAQ section
- [ ] Mobile responsive testing

### Evening
- [ ] Deploy landing page to Vercel (staging)
- [ ] Point postagentpro.com DNS to Vercel
- [ ] Test live site

**Deliverable:** Live landing page at postagentpro.com

---

## Day 2: API Scaffolding & Database

### Tasks (4-6 hours)
- [ ] Initialize Express.js API
- [ ] Set up Prisma with PostgreSQL
- [ ] Create database schema in Prisma format
- [ ] Run initial migration (create all tables)
- [ ] Create basic API routes:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/health` (health check)
- [ ] JWT authentication middleware
- [ ] Set up CORS for web client

**Deliverable:** Working API with auth endpoints

---

## Day 3: Platform Registration & OAuth Setup

### Google Cloud Console (2 hours)
- [ ] Create new project: "PostAgentPro"
- [ ] Enable Google My Business API
- [ ] Create OAuth 2.0 credentials (web application)
- [ ] Set authorized redirect URIs
- [ ] Note Client ID + Secret
- [ ] Submit app verification form (approval takes 2-4 weeks)

### Meta Developer Portal (2 hours)
- [ ] Create new app: "PostAgentPro"
- [ ] Add Facebook Login product
- [ ] Add Instagram Basic Display
- [ ] Configure OAuth redirect URIs
- [ ] Note App ID + App Secret
- [ ] Add test users for development
- [ ] Submit app review for `pages_manage_posts` permission (approval takes 3-7 days)

### OpenAI & Pexels (30 min)
- [ ] Confirm OpenAI API key active
- [ ] Register for Pexels API key (free, instant)

**Deliverable:** All API credentials ready for development

---

## Day 4: Stripe Integration

### Tasks (3-4 hours)
- [ ] Create Stripe account (or use existing)
- [ ] Create 3 products (Starter $10, Pro $30, Premium $50)
- [ ] Set up subscription billing (monthly recurring)
- [ ] Create test mode products
- [ ] API route: `POST /api/stripe/create-checkout` (redirect to Stripe Checkout)
- [ ] API route: `POST /api/stripe/webhook` (handle subscription events)
- [ ] Test signup flow → Stripe Checkout → webhook

**Deliverable:** Working payment flow (test mode)

---

## Day 5: OAuth Flows (Google + Meta)

### Google OAuth (3 hours)
- [ ] API route: `GET /api/auth/google` (initiate OAuth)
- [ ] API route: `GET /api/auth/google/callback` (handle redirect)
- [ ] Exchange code for access token
- [ ] Fetch user's Google Business locations
- [ ] Store encrypted tokens in `connected_accounts` table
- [ ] Test: Connect account → see locations

### Meta OAuth (3 hours)
- [ ] API route: `GET /api/auth/facebook` (initiate OAuth)
- [ ] API route: `GET /api/auth/facebook/callback` (handle redirect)
- [ ] Exchange short-lived for long-lived token
- [ ] Fetch user's Facebook Pages
- [ ] Store encrypted tokens in `connected_accounts` table
- [ ] Test: Connect account → see Pages

**Deliverable:** Working OAuth flows for both platforms

---

## Day 6: Dashboard UI

### Tasks (4-5 hours)
- [ ] Create `/dashboard` page (Next.js)
- [ ] Show connected accounts (Google + Facebook status)
- [ ] "Connect Google Business" button → OAuth flow
- [ ] "Connect Facebook Page" button → OAuth flow
- [ ] Display: "Your next post goes live on [date]"
- [ ] Settings page (business profile form)
- [ ] Navigation menu (Dashboard, Settings, Logout)

**Deliverable:** Functional dashboard with account connection

---

## Day 7: Testing & Polish

### Tasks (3-4 hours)
- [ ] End-to-end test: Signup → Payment → Connect accounts → Dashboard
- [ ] Fix bugs found during testing
- [ ] Mobile responsive checks (landing + dashboard)
- [ ] Add loading states to all buttons
- [ ] Add error messages for failed API calls
- [ ] Write deployment guide (docs/DEPLOYMENT.md)

### Stretch Goals (if time)
- [ ] Add email verification (Resend)
- [ ] Add "Forgot password" flow
- [ ] Add basic analytics (PostHog)

**Deliverable:** Polished, working app ready for Week 2 (content generation)

---

## Week 1 Success Criteria

### Must-Have ✅
1. Landing page live at postagentpro.com
2. Users can sign up + pay (Stripe test mode)
3. Users can connect Google Business + Facebook
4. Dashboard shows connected accounts
5. Database stores users + tokens

### Nice-to-Have 🎯
1. Email verification working
2. Forgot password working
3. Analytics tracking set up
4. Help docs started

---

## Next Week Preview (Week 2)

**Focus:** Content generation + posting logic

- OpenAI API integration (GPT-4o-mini)
- Pexels API integration (stock photos)
- BullMQ job queue setup
- Test posting to Google + Facebook (sandbox)
- Build post queue dashboard

---

## Tools & Resources

**Design:**
- Tailwind CSS docs: https://tailwindcss.com
- shadcn/ui components: https://ui.shadcn.com

**APIs:**
- Google My Business API: https://developers.google.com/my-business
- Meta Graph API: https://developers.facebook.com/docs/graph-api
- OpenAI API: https://platform.openai.com/docs
- Pexels API: https://www.pexels.com/api

**Infrastructure:**
- Fly.io docs: https://fly.io/docs
- Vercel docs: https://vercel.com/docs
- Prisma docs: https://www.prisma.io/docs

---

**Status:** Day 1 in progress. Let's ship this! 🚀
