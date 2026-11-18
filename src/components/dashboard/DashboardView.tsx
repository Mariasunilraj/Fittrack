import React from 'react';
import { DashboardProfileHeader } from './DashboardProfileHeader';
import { DashboardWeightGoalChart } from './DashboardWeightGoalChart';
import { DashboardTodayWorkoutPlan } from './DashboardTodayWorkoutPlan';
import { DashboardNutritionPlan } from './DashboardNutritionPlan';
import { DashboardWeeklyWorkoutChart } from './DashboardWeeklyWorkoutChart';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn pb-nav-safe">
      {/* 1. PROFILE SECTION: Visible Name and Age */}
      <section aria-label="User Profile">
        <DashboardProfileHeader />
      </section>

      {/* 2. BODY WEIGHT SECTION: Current Body Weight & Target Goal (In Graph) */}
      <section aria-label="Current Weight and Goal Weight Graph">
        <DashboardWeightGoalChart />
      </section>

      {/* 3. TODAY'S WORKOUT PLAN: Calisthenics, Taekwondo, and Gym */}
      <section aria-label="Today's Workout Plan Across Calisthenics, Taekwondo, and Gym">
        <DashboardTodayWorkoutPlan />
      </section>

      {/* 4. TODAY'S NUTRITION PLAN: Daily Macros & Meal Outline */}
      <section aria-label="Nutrition Plan of the Day">
        <DashboardNutritionPlan />
      </section>

      {/* 5. WEEKLY WORKOUT GRAPH: Workouts Done in the Whole Week */}
      <section aria-label="Weekly Workout Activity Graph">
        <DashboardWeeklyWorkoutChart />
      </section>
    </div>
  );
};
