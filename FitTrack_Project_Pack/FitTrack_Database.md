# FitTrack — Suggested Database Structure

Use PostgreSQL with UUID primary keys, timestamps, foreign keys and Row Level Security (RLS).

| Table | Purpose | Key fields |
|---|---|---|
| profiles | Adult user profile | id, user_id, display_name, birth_year/date, height_cm, current_weight_kg, experience_level |
| user_preferences | User settings | user_id, region, language, units, food_preference, allergies |
| fitness_goals | User goals | id, user_id, goal_type, target_value, target_date, status |
| training_plans | Training programmes | id, user_id, name, goal, level, active |
| training_days | Plan schedule | id, plan_id, weekday, title, rest_day |
| training_sessions | Actual sessions | id, user_id, plan_id, started_at, duration_minutes, RPE, notes |
| exercise_library | Exercise catalogue | id, name, discipline, equipment, difficulty, instructions, safety_notes |
| session_exercises | Planned exercises | id, session_id, exercise_id, order_index, sets, target_reps, target_time |
| exercise_logs | Completed sets | id, user_id, session_id, exercise_id, set_number, reps, load_kg, duration_seconds, RPE |
| strength_records | Personal bests | id, user_id, exercise_id, record_type, value, achieved_at |
| body_measurements | Body tracking | id, user_id, measured_at, weight_kg, waist_cm, chest_cm, arm_cm, thigh_cm |
| food_items | Food catalogue | id, name, region, serving_description, calories, protein_g, carbs_g, fat_g, source |
| recipes | User / curated recipes | id, user_id nullable, name, ingredients_json, servings |
| nutrition_logs | Meal entries | id, user_id, food_item_id nullable, recipe_id nullable, meal_type, portion, logged_at |
| hydration_logs | Water intake | id, user_id, amount_ml, logged_at |
| taekwondo_logs | Martial arts sessions | id, user_id, session_date, duration_minutes, focus, effort, coach_notes |
| cardio_logs | Cardio activities | id, user_id, activity, distance_km, duration_minutes, logged_at |
| mobility_logs | Mobility sessions | id, user_id, focus_area, duration_minutes, notes |
| recovery_logs | Optional self-reports | id, user_id, sleep_hours, soreness, energy, logged_at |
| achievements | Milestones | id, user_id, achievement_type, achieved_at |
| consent_records | Optional sharing consent | id, user_id, grantee_id, scope, granted_at, revoked_at |

## Implementation notes
- Use Supabase Auth user IDs as the identity source.
- Every private row must have a user ownership relationship and RLS policy.
- Enable RLS on all user-owned tables; deny access by default.
- Coach access must be separately designed with explicit, revocable, scope-limited consent.
- Food nutrient values need a source and should be labelled estimates when uncertain.
- Use private storage buckets and signed URLs for progress photos.
- Do not store more health information than necessary.
- Add indexes for user_id, logged_at, session_date and common search/filter fields.
- Validate all values on both client and server.
