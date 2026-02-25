# Spanky's TODO - PostAgentPro

**Created:** Feb 24, 2026 - 1:35 PM  
**Status:** Landing page built, ready for deployment

---

## ✅ DONE TODAY

- [x] Secured domain: postagentpro.com
- [x] Project structure created
- [x] Database schema designed
- [x] Landing page copy written
- [x] Landing page built (Next.js + Tailwind)
- [x] Dev server running locally (http://localhost:3000)

---

## 🔥 IMMEDIATE (When You Have Time)

### 1. Review Landing Page
- Open http://localhost:3000 in your browser
- Check all sections (Hero, Problem, Solution, Benefits, Testimonials, Pricing, FAQ, Footer)
- Test mobile view (resize browser or use dev tools)
- Give feedback on design/copy if needed

### 2. Deploy to Vercel (10 minutes)
**Steps:**
1. Go to https://vercel.com and sign in (or create account)
2. Click "Add New Project"
3. Import from Git (connect GitHub if needed)
4. Select `postagentpro/web` folder
5. Click Deploy
6. Once deployed, copy the URL

### 3. Point Domain to Vercel (5 minutes)
**Steps:**
1. In Vercel project settings, click "Domains"
2. Add `postagentpro.com` and `www.postagentpro.com`
3. Vercel will show DNS records to add
4. Go to your domain registrar (wherever you bought postagentpro.com)
5. Add the DNS records Vercel shows you
6. Wait 10-60 minutes for DNS to propagate
7. Landing page will be live at postagentpro.com

---

## 📋 THIS WEEK (Day 2-7)

### Day 2: API Scaffolding & Database
- [ ] Set up Express.js API
- [ ] Set up PostgreSQL (Fly.io or local)
- [ ] Create database schema (run migrations)
- [ ] Build auth endpoints (signup/login)

### Day 3: Platform Registration
- [ ] Google Cloud Console - register for My Business API
- [ ] Meta Developer - register for Facebook/Instagram API
- [ ] Get OpenAI API key (if you don't have one)
- [ ] Get Pexels API key (free, instant)

### Day 4: Stripe Integration
- [ ] Create Stripe products (Starter $10, Pro $30, Premium $50)
- [ ] Set up subscription billing
- [ ] Test payment flow

### Day 5: OAuth Flows
- [ ] Build Google Business OAuth connection
- [ ] Build Facebook OAuth connection
- [ ] Test account connections

### Day 6: Dashboard UI
- [ ] Build dashboard page
- [ ] Show connected accounts
- [ ] Settings page

### Day 7: Testing & Polish
- [ ] End-to-end test (signup → payment → connect accounts)
- [ ] Fix bugs
- [ ] Mobile responsive checks

---

## 📦 ACCOUNTS NEEDED (Sign Up When Ready)

- [ ] Vercel account (for hosting frontend)
- [ ] Fly.io account (for hosting API + database)
- [ ] Google Cloud Console (for My Business API)
- [ ] Meta Developer (for Facebook/Instagram API)
- [ ] Stripe account (for payments)
- [ ] OpenAI account (for GPT-4o-mini)
- [ ] Pexels account (for stock photos)

---

## 💰 COSTS (During Development)

**Expected monthly:**
- Fly.io (API + DB): ~$20/month
- Vercel: Free (hobby tier)
- Upstash Redis: ~$10/month
- Cloudflare R2: ~$5/month
- **Total: ~$35/month** until you have paying users

**Per-user costs (once launched):**
- OpenAI API: ~$0.002 per user per month
- Very cheap at scale

---

## 📚 RESOURCES (Links)

**Project Files:**
- `postagentpro/docs/DATABASE-SCHEMA.md` - Complete database design
- `postagentpro/docs/LANDING-PAGE-COPY.md` - Marketing copy
- `postagentpro/docs/BUILD-PLAN-WEEK-1.md` - Week 1 tasks breakdown
- `postagentpro/README.md` - Project overview

**Original Spec:**
- `AI-Social-Media-Autoposter-Spec.md` - Full product specification (12-week plan)

**API Documentation:**
- Google My Business: https://developers.google.com/my-business
- Meta Graph API: https://developers.facebook.com/docs/graph-api
- OpenAI: https://platform.openai.com/docs
- Pexels: https://www.pexels.com/api

---

## 🎯 WEEK 1 GOAL

**Landing page live + Users can sign up + Connect social accounts**

By end of Week 1, you should have:
- Live landing page at postagentpro.com ✅ (almost there)
- Working signup/payment flow
- Users can connect Google Business + Facebook
- Foundation ready for Week 2 (content generation + posting)

---

## 🚀 NEXT SESSION PROMPT

**"Continue building PostAgentPro - I'm ready for [Day 2/Day 3/etc]"**

Or if you just want a status check:  
**"What's the status on PostAgentPro?"**

---

**Remember:** You have 12 weeks to launch. Week 10 = beta (50 users). Week 12 = full launch (email all 7,744 contractor leads).

**Current pace:** ✅ ON TRACK (Day 1 almost complete)
