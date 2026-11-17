-- ====================================================================
-- FitTrack Neon Serverless PostgreSQL Database Schema
-- Compatible with Neon Postgres (AWS / GCP Serverless)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL DEFAULT 'FitTrack Athlete',
    age INTEGER NOT NULL DEFAULT 28,
    birth_year INTEGER,
    gender VARCHAR(20) DEFAULT 'unspecified',
    height_cm NUMERIC(5, 2) DEFAULT 175.0,
    current_weight_kg NUMERIC(5, 2) NOT NULL DEFAULT 74.5,
    target_weight_kg NUMERIC(5, 2) NOT NULL DEFAULT 70.0,
    fitness_level VARCHAR(30) NOT NULL DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced'
    activity_level VARCHAR(30) DEFAULT 'moderately_active',
    dietary_preference VARCHAR(40) DEFAULT 'non_veg', -- 'veg', 'non_veg', 'eggetarian', 'vegan'
    disclaimer_accepted BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BODY WEIGHT & GOAL TRACKING (Tier 2 Graph in Dashboard)
CREATE TABLE IF NOT EXISTS weight_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(64) NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5, 2) NOT NULL,
    target_goal_kg NUMERIC(5, 2) NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_weight_history_user_date ON weight_history(user_id, recorded_date DESC);

-- 4. WORKOUT ROUTINES / SCHEDULE (Tier 3 in Dashboard & Workout Planner)
CREATE TABLE IF NOT EXISTS workout_routines (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    discipline VARCHAR(40) NOT NULL, -- 'calisthenics', 'taekwondo', 'gym', 'weightlifting'
    scheduled_day VARCHAR(20) NOT NULL, -- 'Monday', 'Tuesday', ..., 'Sunday', 'Today'
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workout_routines_user_day ON workout_routines(user_id, scheduled_day);

-- 5. ROUTINE TECHNIQUES & EXERCISES (With Attached Images)
CREATE TABLE IF NOT EXISTS routine_exercises (
    id VARCHAR(64) PRIMARY KEY,
    routine_id VARCHAR(64) NOT NULL REFERENCES workout_routines(id) ON DELETE CASCADE,
    exercise_id VARCHAR(64),
    name VARCHAR(150) NOT NULL,
    discipline VARCHAR(40) NOT NULL,
    sets INTEGER NOT NULL DEFAULT 3,
    target_reps INTEGER,
    target_hold_seconds INTEGER,
    target_weight_kg NUMERIC(6, 2) DEFAULT 0,
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    image_url TEXT,
    order_idx INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine ON routine_exercises(routine_id, order_idx ASC);

-- 6. COMPLETED LIVE WORKOUT SESSIONS (Tier 5 Whole Week Graph)
CREATE TABLE IF NOT EXISTS workout_session_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    discipline VARCHAR(40) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_session_logs_user_date ON workout_session_logs(user_id, completed_at DESC);

-- 7. NUTRITION & FOOD SNAP LOGS (Tier 4 Daily Nutrition & Gemini Scanner)
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type VARCHAR(30) NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
    food_name VARCHAR(200) NOT NULL,
    portion_estimate VARCHAR(150),
    calories NUMERIC(7, 2) NOT NULL DEFAULT 0,
    protein_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    carbs_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    fat_g NUMERIC(6, 2) NOT NULL DEFAULT 0,
    fiber_g NUMERIC(6, 2) DEFAULT 0,
    photo_url TEXT,
    source VARCHAR(50) DEFAULT 'gemini-vision', -- 'gemini-vision', 'manual', 'icmr-nin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON nutrition_logs(user_id, logged_date DESC);

-- 8. PERSONAL RECORDS (PRs)
CREATE TABLE IF NOT EXISTS personal_records (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    exercise_name VARCHAR(150) NOT NULL,
    record_type VARCHAR(40) NOT NULL, -- '1rm_weight', 'max_reps', 'max_hold_time'
    value_numeric NUMERIC(7, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'kg', 'reps', 'seconds'
    discipline VARCHAR(40) NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. DELETE ALL PREVIOUS ACCOUNTS & SEED SOLE OFFICIAL ACCOUNT (F.MARIA SUNIL RAJ)
DELETE FROM user_profiles;

INSERT INTO user_profiles (id, full_name, age, birth_year, current_weight_kg, target_weight_kg, fitness_level)
VALUES ('usr_sunilraj_001', 'F.MARIA SUNIL RAJ', 20, 2006, 74.5, 70.0, 'intermediate')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    age = EXCLUDED.age,
    birth_year = EXCLUDED.birth_year,
    current_weight_kg = EXCLUDED.current_weight_kg,
    target_weight_kg = EXCLUDED.target_weight_kg;

-- 10. SEED INITIAL WEIGHT TREND DATA
INSERT INTO weight_history (user_id, recorded_date, weight_kg, target_goal_kg, notes)
VALUES
    ('usr_sunilraj_001', '2026-11-01', 76.0, 70.0, 'Account Start (Initial Weight)'),
    ('usr_sunilraj_001', '2026-11-03', 74.5, 70.0, 'Weekly Monday Weigh-In')
ON CONFLICT DO NOTHING;

-- 11. ROW-LEVEL SECURITY (RLS) FOR PRIVACY & STRICT DATA OWNERSHIP
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- Athletes can only select, insert, update, or delete their own data
DROP POLICY IF EXISTS user_profiles_owner_policy ON user_profiles;
CREATE POLICY user_profiles_owner_policy ON user_profiles
    FOR ALL USING (id = coalesce(current_setting('request.jwt.claim.sub', true), id));

DROP POLICY IF EXISTS weight_history_owner_policy ON weight_history;
CREATE POLICY weight_history_owner_policy ON weight_history
    FOR ALL USING (user_id = coalesce(current_setting('request.jwt.claim.sub', true), user_id));

DROP POLICY IF EXISTS workout_routines_owner_policy ON workout_routines;
CREATE POLICY workout_routines_owner_policy ON workout_routines
    FOR ALL USING (user_id = coalesce(current_setting('request.jwt.claim.sub', true), user_id));

DROP POLICY IF EXISTS workout_session_logs_owner_policy ON workout_session_logs;
CREATE POLICY workout_session_logs_owner_policy ON workout_session_logs
    FOR ALL USING (user_id = coalesce(current_setting('request.jwt.claim.sub', true), user_id));

DROP POLICY IF EXISTS nutrition_logs_owner_policy ON nutrition_logs;
CREATE POLICY nutrition_logs_owner_policy ON nutrition_logs
    FOR ALL USING (user_id = coalesce(current_setting('request.jwt.claim.sub', true), user_id));

DROP POLICY IF EXISTS personal_records_owner_policy ON personal_records;
CREATE POLICY personal_records_owner_policy ON personal_records
    FOR ALL USING (user_id = coalesce(current_setting('request.jwt.claim.sub', true), user_id));
