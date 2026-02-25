# PostAgentPro - Database Schema
**Created:** February 24, 2026  
**Database:** PostgreSQL 15+

---

## Core Tables

### users
Primary user accounts (authentication + billing)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  plan_tier TEXT DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'pro', 'premium')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'canceled', 'trial')),
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe ON users(stripe_customer_id);
```

---

### businesses
Business profile for content generation context

```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'plumber', 'electrician', 'roofer', etc.
  location_city TEXT,
  location_state TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  brand_voice TEXT DEFAULT 'professional', -- 'professional', 'casual', 'friendly', etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_businesses_user ON businesses(user_id);
```

---

### connected_accounts
OAuth tokens for social media platforms

```sql
CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('google', 'facebook', 'instagram')),
  account_id TEXT NOT NULL, -- Platform-specific ID (Page ID, Location ID)
  account_name TEXT, -- Display name ("Bob's Plumbing - Austin")
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  connected_at TIMESTAMP DEFAULT NOW(),
  last_refreshed_at TIMESTAMP,
  UNIQUE(user_id, platform, account_id)
);

CREATE INDEX idx_connected_accounts_user ON connected_accounts(user_id);
CREATE INDEX idx_connected_accounts_expires ON connected_accounts(token_expires_at) WHERE status = 'active';
```

---

### media_library
Photos uploaded by Pro/Premium users

```sql
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL, -- Cloudflare R2 URL
  size_bytes INTEGER,
  mime_type TEXT,
  source TEXT DEFAULT 'upload' CHECK (source IN ('upload', 'stock')), -- 'upload' or 'stock' (Pexels)
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_media_user ON media_library(user_id);
```

---

### post_queue
Scheduled and published posts

```sql
CREATE TABLE post_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES connected_accounts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('google', 'facebook', 'instagram')),
  
  -- Content
  content TEXT NOT NULL, -- Post caption/text
  media_url TEXT, -- Optional photo/video URL
  hashtags TEXT[], -- Instagram hashtags
  
  -- Scheduling
  scheduled_for TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published', 'failed')),
  
  -- Publishing metadata
  platform_post_id TEXT, -- ID from platform API after publishing
  published_at TIMESTAMP,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Approval (Pro/Premium)
  requires_approval BOOLEAN DEFAULT false,
  approved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_post_queue_user ON post_queue(user_id);
CREATE INDEX idx_post_queue_scheduled ON post_queue(scheduled_for) WHERE status IN ('pending', 'approved');
CREATE INDEX idx_post_queue_status ON post_queue(status);
```

---

### analytics
Engagement metrics fetched from platform APIs

```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES post_queue(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  
  -- Metrics
  reach INTEGER DEFAULT 0, -- People who saw the post
  impressions INTEGER DEFAULT 0, -- Total views (can be > reach)
  clicks INTEGER DEFAULT 0, -- Link clicks / call-to-action
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2), -- (likes + comments + shares) / reach * 100
  
  -- Metadata
  fetched_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_post ON analytics(post_id);
```

---

### content_templates
AI prompt templates for different business types

```sql
CREATE TABLE content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_type TEXT NOT NULL,
  theme TEXT NOT NULL, -- 'tip', 'promotion', 'seasonal', 'testimonial', 'fun_fact'
  template_text TEXT NOT NULL, -- Prompt template with {placeholders}
  platform TEXT, -- If platform-specific, otherwise NULL = all platforms
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_type ON content_templates(business_type);
```

---

### user_preferences
User-specific posting settings

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Scheduling preferences
  posting_frequency INTEGER DEFAULT 3, -- Posts per week
  preferred_times TIME[], -- e.g., ['09:00', '13:00', '17:00']
  timezone TEXT DEFAULT 'America/New_York',
  
  -- Content preferences
  themes_enabled TEXT[] DEFAULT ARRAY['tip', 'promotion', 'seasonal'], -- Which themes to use
  avoid_keywords TEXT[], -- Words/phrases to avoid in generated content
  
  -- Notification preferences
  email_weekly_summary BOOLEAN DEFAULT true,
  email_monthly_report BOOLEAN DEFAULT true,
  push_approval_needed BOOLEAN DEFAULT true, -- Pro/Premium approval notifications
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### stock_photo_cache
Cache Pexels/Unsplash photos to avoid repeat API calls

```sql
CREATE TABLE stock_photo_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_type TEXT NOT NULL,
  search_query TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  photographer_name TEXT,
  photographer_url TEXT,
  source TEXT NOT NULL CHECK (source IN ('pexels', 'unsplash')),
  cached_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_type, photo_url)
);

CREATE INDEX idx_stock_cache_type ON stock_photo_cache(business_type);
```

---

## Indexes Summary

**Performance-critical queries:**
- Find posts due for publishing: `idx_post_queue_scheduled`
- Find expiring tokens: `idx_connected_accounts_expires`
- User dashboard queries: `idx_post_queue_user`, `idx_media_user`
- Analytics aggregation: `idx_analytics_post`

---

## Row-Level Security (RLS)

If using Supabase, enable RLS on all tables:

```sql
-- Users can only access their own data
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_business" ON businesses
  FOR ALL USING (user_id = auth.uid());

-- Repeat for: connected_accounts, media_library, post_queue, analytics, user_preferences
```

---

## Migrations

**Create migrations folder:**
```
/api/migrations/
  001_initial_schema.sql
  002_add_analytics.sql
  003_add_preferences.sql
```

**Run with:** Prisma Migrate or custom Node.js script

---

## Sample Queries

**Get user's next scheduled post:**
```sql
SELECT * FROM post_queue
WHERE user_id = $1
  AND status IN ('pending', 'approved')
  AND scheduled_for > NOW()
ORDER BY scheduled_for ASC
LIMIT 1;
```

**Get monthly analytics for user:**
```sql
SELECT 
  DATE_TRUNC('day', p.published_at) as date,
  COUNT(*) as posts,
  SUM(a.reach) as total_reach,
  AVG(a.engagement_rate) as avg_engagement
FROM post_queue p
LEFT JOIN analytics a ON a.post_id = p.id
WHERE p.user_id = $1
  AND p.published_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', p.published_at)
ORDER BY date ASC;
```

---

**Status:** ✅ Schema ready for implementation
