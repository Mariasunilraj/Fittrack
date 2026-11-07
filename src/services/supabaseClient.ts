import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback local storage configuration
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const localConfig = (() => {
  try {
    const raw = localStorage.getItem('fittrack_supabase_config');
    return raw ? JSON.parse(raw) : { url: '', anonKey: '' };
  } catch {
    return { url: '', anonKey: '' };
  }
})();

const finalUrl = envUrl || localConfig.url || 'https://demo.supabase.co';
const finalKey = envAnonKey || localConfig.anonKey || 'demo-anon-key';

export const isSupabaseConfigured = Boolean(
  (envUrl && envAnonKey) || (localConfig.url && localConfig.anonKey)
);

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export const SUPABASE_SQL_MIGRATION = `-- FitTrack PostgreSQL Schema with Row Level Security (RLS)
-- Run this in your Supabase SQL Editor to initialize your production database

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  age_band TEXT NOT NULL,
  height_cm NUMERIC,
  current_weight_kg NUMERIC,
  target_weight_kg NUMERIC,
  experience_level TEXT DEFAULT 'beginner',
  region TEXT DEFAULT 'all',
  food_preference TEXT DEFAULT 'vegetarian',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Training Plans
CREATE TABLE IF NOT EXISTS public.training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  discipline TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Exercise Logs
CREATE TABLE IF NOT EXISTS public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  discipline TEXT NOT NULL,
  sets_completed JSONB NOT NULL DEFAULT '[]'::jsonb,
  rpe INTEGER,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Indian Nutrition Logs
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_name TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  portions NUMERIC DEFAULT 1,
  calories NUMERIC NOT NULL,
  protein_g NUMERIC DEFAULT 0,
  carbs_g NUMERIC DEFAULT 0,
  fat_g NUMERIC DEFAULT 0,
  fiber_g NUMERIC DEFAULT 0,
  logged_at DATE DEFAULT CURRENT_DATE
);

-- 5. Hydration Logs
CREATE TABLE IF NOT EXISTS public.hydration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_ml INTEGER NOT NULL,
  target_ml INTEGER DEFAULT 3000,
  logged_at DATE DEFAULT CURRENT_DATE
);

-- 6. Taekwondo Martial Arts Sessions
CREATE TABLE IF NOT EXISTS public.taekwondo_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  focus_area TEXT NOT NULL,
  belt_rank TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  instructor_notes TEXT,
  rpe INTEGER,
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Recovery Logs
CREATE TABLE IF NOT EXISTS public.recovery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sleep_hours NUMERIC NOT NULL,
  soreness_rating INTEGER NOT NULL,
  energy_rating INTEGER NOT NULL,
  logged_at DATE DEFAULT CURRENT_DATE
);

-- 8. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taekwondo_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_logs ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies: Restrict access strictly to authenticated owners
CREATE POLICY "Users can only read and manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access own plans"
  ON public.training_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access own workout logs"
  ON public.exercise_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access own nutrition logs"
  ON public.nutrition_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access own hydration logs"
  ON public.hydration_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access own taekwondo logs"
  ON public.taekwondo_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only access own recovery logs"
  ON public.recovery_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 10. Purge All Outdated Accounts & Seed Sole Official Account: F.MARIA SUNIL RAJ (Age: 20)
DELETE FROM public.profiles;

INSERT INTO public.profiles (
  id,
  user_id,
  display_name,
  age_band,
  height_cm,
  current_weight_kg,
  target_weight_kg,
  experience_level,
  region,
  food_preference
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'F.MARIA SUNIL RAJ',
  '18-29',
  175.0,
  74.5,
  70.0,
  'intermediate',
  'south-indian',
  'non-vegetarian'
) ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  age_band = EXCLUDED.age_band,
  current_weight_kg = EXCLUDED.current_weight_kg,
  target_weight_kg = EXCLUDED.target_weight_kg;
`;
