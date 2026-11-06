import { neon } from '@neondatabase/serverless';

let sqlClient = null;

export function getNeonSql() {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_URL ||
    process.env.NEON_DATABASE_URL;

  if (!dbUrl || dbUrl.includes('YOUR_NEON_PASSWORD')) {
    return null;
  }

  if (!sqlClient) {
    try {
      sqlClient = neon(dbUrl);
    } catch (err) {
      console.error('[FitTrack Neon] Failed to initialize Neon client:', err);
      return null;
    }
  }

  return sqlClient;
}

export async function testNeonConnection() {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_URL ||
    process.env.NEON_DATABASE_URL;

  if (!dbUrl || dbUrl.includes('YOUR_NEON_PASSWORD')) {
    return {
      connected: false,
      message: 'DATABASE_URL (or POSTGRES_URL / STORAGE_URL) is not set or contains placeholder credentials',
      configured: false
    };
  }

  try {
    const sql = getNeonSql();
    if (!sql) {
      return {
        connected: false,
        message: 'Could not create Neon SQL client from connection string',
        configured: true
      };
    }

    const result = await sql`SELECT NOW() as current_time, current_database() as db_name, version() as pg_version`;
    return {
      connected: true,
      message: 'Successfully connected to Neon Serverless PostgreSQL',
      database: result[0]?.db_name || 'neondb',
      serverTime: result[0]?.current_time,
      postgresVersion: result[0]?.pg_version?.split(' ')?.[0] || 'PostgreSQL',
      configured: true
    };
  } catch (err) {
    return {
      connected: false,
      message: `Neon connection error: ${err.message}`,
      configured: true
    };
  }
}

export async function syncUserProfileToNeon(profile) {
  const sql = getNeonSql();
  if (!sql) return null;

  try {
    const rows = await sql`
      INSERT INTO user_profiles (id, full_name, age, current_weight_kg, target_weight_kg, fitness_level, updated_at)
      VALUES (
        ${profile.id || 'usr_demo_001'},
        ${profile.name || 'FitTrack Athlete'},
        ${profile.age || 28},
        ${profile.weightKg || 74.5},
        ${profile.targetWeightKg || 70.0},
        ${profile.level || 'intermediate'},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        age = EXCLUDED.age,
        current_weight_kg = EXCLUDED.current_weight_kg,
        target_weight_kg = EXCLUDED.target_weight_kg,
        fitness_level = EXCLUDED.fitness_level,
        updated_at = NOW()
      RETURNING *;
    `;
    return rows[0];
  } catch (err) {
    console.error('[Neon Sync] Profile sync error:', err.message);
    return null;
  }
}

export async function logWeightEntryToNeon(userId, weightKg, targetGoalKg, notes = '') {
  const sql = getNeonSql();
  if (!sql) return null;

  try {
    const rows = await sql`
      INSERT INTO weight_history (user_id, weight_kg, target_goal_kg, notes)
      VALUES (${userId || 'usr_demo_001'}, ${weightKg}, ${targetGoalKg}, ${notes})
      RETURNING *;
    `;
    return rows[0];
  } catch (err) {
    console.error('[Neon Sync] Weight log error:', err.message);
    return null;
  }
}

export async function logNutritionToNeon(userId, item) {
  const sql = getNeonSql();
  if (!sql) return null;

  try {
    const rows = await sql`
      INSERT INTO nutrition_logs (
        user_id, meal_type, food_name, portion_estimate, calories, protein_g, carbs_g, fat_g, fiber_g, photo_url, source
      )
      VALUES (
        ${userId || 'usr_demo_001'},
        ${item.mealType || 'lunch'},
        ${item.name || 'Indian Balanced Meal'},
        ${item.portion || '1 standard portion'},
        ${item.calories || 0},
        ${item.protein || 0},
        ${item.carbs || 0},
        ${item.fat || 0},
        ${item.fiber || 0},
        ${item.photoUrl || null},
        ${item.source || 'gemini-vision'}
      )
      RETURNING *;
    `;
    return rows[0];
  } catch (err) {
    console.error('[Neon Sync] Nutrition log error:', err.message);
    return null;
  }
}
