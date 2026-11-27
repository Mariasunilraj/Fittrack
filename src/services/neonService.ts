// ====================================================================
// FitTrack PRO — Neon Serverless PostgreSQL Service
// Relational Database Operations for Profiles, Weigh-Ins, and Logs
// ====================================================================

import { UserProfile, WeightLogEntry, WorkoutLogEntry, MealLogItem } from '../types';
import { storageService } from './storage';

export interface NeonConnectionStatus {
  connected: boolean;
  message: string;
  configured: boolean;
  database?: string;
  serverTime?: string;
  postgresVersion?: string;
}

export const neonService = {
  // Check health and connectivity to Neon PostgreSQL
  async checkHealth(): Promise<NeonConnectionStatus> {
    try {
      const res = await fetch('/api/neon/health');
      if (res.ok) {
        return await res.json();
      }
      return {
        connected: false,
        configured: false,
        message: 'Neon serverless endpoint returned ' + res.status
      };
    } catch {
      return {
        connected: false,
        configured: false,
        message: 'Running in offline/local-first mode with storage sync.'
      };
    }
  },

  // Sync Athlete Profile to Neon PostgreSQL
  async syncProfile(profile: UserProfile): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/neon/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...storageService.getAuthHeaders()
        },
        body: JSON.stringify(profile)
      });
      return { success: res.ok };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  // Log a Monday Weekly Weigh-In to Neon PostgreSQL
  async logWeighIn(userId: string, weightKg: number, targetGoalKg: number, notes?: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch('/api/neon/weigh-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...storageService.getAuthHeaders()
        },
        body: JSON.stringify({
          userId,
          weightKg,
          targetGoalKg,
          notes: notes || 'Weekly Monday Weigh-In',
          recordedDate: new Date().toISOString().split('T')[0]
        })
      });
      return { success: res.ok };
    } catch {
      return { success: false };
    }
  },

  // Record a completed workout session to Neon PostgreSQL
  async logWorkout(sessionLog: WorkoutLogEntry): Promise<{ success: boolean }> {
    try {
      const res = await fetch('/api/neon/workout-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...storageService.getAuthHeaders()
        },
        body: JSON.stringify(sessionLog)
      });
      return { success: res.ok };
    } catch {
      return { success: false };
    }
  },

  // Record a nutrition meal item to Neon PostgreSQL
  async logNutrition(meal: MealLogItem): Promise<{ success: boolean }> {
    try {
      const res = await fetch('/api/neon/nutrition-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...storageService.getAuthHeaders()
        },
        body: JSON.stringify(meal)
      });
      return { success: res.ok };
    } catch {
      return { success: false };
    }
  }
};
