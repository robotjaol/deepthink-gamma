-- DeepThink Supabase Schema
-- This script is designed to be executed in its entirety in the Supabase SQL Editor.
-- It sets up all tables, types, policies, and triggers for the MVP.

-- =============================================================================
-- SECTION 1: CUSTOM TYPES
-- =============================================================================
CREATE TYPE public.scenario_level AS ENUM ('Newbie', 'Expert', 'Specialist');
CREATE TYPE public.task_priority AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE public.task_status AS ENUM ('To Do', 'In Progress', 'Done');

-- =============================================================================
-- SECTION 2: TABLE CREATION
-- =============================================================================

-- Table for public user profiles, linked to Supabase Auth
CREATE TABLE public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  profile_picture_url TEXT,
  hobbies TEXT[],
  contacts JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Central table for all user stats and gamification
CREATE TABLE public.leaderboard (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  points INT DEFAULT 0,
  daily_streak INT DEFAULT 0,
  last_session_date DATE,
  dev_level INT DEFAULT 1,
  dev_xp INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for official, pre-made scenario templates
CREATE TABLE public.scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  job_type VARCHAR(100) NOT NULL,
  level public.scenario_level NOT NULL,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Table for user-created custom scenarios (Challenges)
CREATE TABLE public.custom_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  job_type VARCHAR(100) NOT NULL,
  level public.scenario_level NOT NULL,
  description TEXT,
  tags TEXT[],
  questions JSONB,
  is_published BOOLEAN DEFAULT FALSE,
  -- Denormalized fields for performance on community page
  author_name VARCHAR(255),
  author_profile_picture_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for user-completed sessions
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scenario_id UUID, -- Can reference 'scenarios' or 'custom_scenarios'
  scenario_name VARCHAR(255) NOT NULL,
  job_type VARCHAR(100) NOT NULL,
  level public.scenario_level NOT NULL,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  final_score INT CHECK (final_score >= 0 AND final_score <= 100),
  analysis_report JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for badge definitions
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  criteria JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Join table for earned badges
CREATE TABLE public.user_badges (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Table for Task Hub tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  priority public.task_priority NOT NULL DEFAULT 'Medium',
  status public.task_status NOT NULL DEFAULT 'To Do',
  due_date DATE,
  xp INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for user notes
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT,
  reminder_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for feature requests
CREATE TABLE public.feature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for subscription status
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  status VARCHAR(50) NOT NULL, -- e.g., 'active', 'trialing', 'canceled'
  plan_name VARCHAR(50) NOT NULL,
  current_period_end TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 3: ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow individual update access" ON public.users FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access for authenticated users" ON public.leaderboard FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Disallow client-side updates" ON public.leaderboard FOR UPDATE USING (false); -- Critical for security

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access for authenticated users" ON public.scenarios FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for session owner" ON public.sessions FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access for authenticated users" ON public.badges FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to earned badges" ON public.user_badges FOR SELECT USING (true);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for task owner" ON public.tasks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for note owner" ON public.notes FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.custom_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for custom scenario owner" ON public.custom_scenarios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow read access for published scenarios" ON public.custom_scenarios FOR SELECT USING (is_published = TRUE);

ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert for authenticated users" ON public.feature_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to read their own requests" ON public.feature_requests FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access for subscription owner" ON public.subscriptions FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- SECTION 4: TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Function to create a public profile and leaderboard entry for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new row into public.users
  INSERT INTO public.users (id, name, profile_picture_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Initialize their leaderboard entry
  INSERT INTO public.leaderboard (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================================================
-- SECTION 5: INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_tasks_user_id_status ON public.tasks(user_id, status);
CREATE INDEX idx_scenarios_job_type ON public.scenarios(job_type);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_custom_scenarios_user_id ON public.custom_scenarios(user_id);
CREATE INDEX idx_custom_scenarios_published ON public.custom_scenarios(is_published);


-- =============================================================================
-- SECTION 6: STORAGE SETUP (Run in SQL Editor or configure via UI)
-- =============================================================================
/*
-- This section is for documentation. Run these commands in the SQL Editor
-- or configure equivalent policies in the Supabase Storage UI.

-- 1. Create a bucket for profile pictures with public read access.
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile_pictures', 'profile_pictures', true);

-- 2. RLS Policy for 'profile_pictures' bucket:
--    - Allow public read access.
--    - Allow authenticated users to upload.
--    - Allow users to update/delete their OWN file.
--      (Requires file path to include user ID, e.g., `{user_id}/avatar.png`)

CREATE POLICY "Public read access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile_pictures');

CREATE POLICY "Authenticated upload access" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profile_pictures' AND auth.role() = 'authenticated');

CREATE POLICY "Owner can update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'profile_pictures' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Owner can delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'profile_pictures' AND auth.uid() = (storage.foldername(name))[1]::uuid);

*/

-- =============================================================================
-- SECTION 7: EDGE FUNCTIONS LOGIC (For reference)
-- =============================================================================
/*
-- This section describes the logic that must be implemented in Supabase Edge Functions.
-- The actual code for these functions resides in the `supabase/functions` directory.

-- A. `on-session-complete`
--    - Trigger: New row inserted into `sessions` table (via Database Webhooks).
--    - Logic: Calculates points, updates streak, awards badges, updates skill XP.

-- B. `on-task-complete`
--    - Trigger: Row updated in `tasks` table where `status` is 'Done'.
--    - Logic: Adds XP, calculates level-ups, awards badges.

-- C. `create-checkout-session`
--    - Trigger: Invoked via HTTP from the client.
--    - Logic: Creates a Stripe Checkout Session for a subscription.

-- D. `stripe-webhook`
--    - Trigger: HTTP POST from Stripe servers.
--    - Logic: Listens for `checkout.session.completed` to update the `subscriptions` table.

-- E. `weekly-league-reset`
--    - Trigger: Scheduled function (cron job).
--    - Logic: Processes promotions/demotions and resets weekly points.

*/