# FitTrack — All-Age Fitness Management Platform (18–60+)

> A modern, accessible fitness product built with **React 19 + TypeScript + Vite + Tailwind CSS**, featuring hybrid disciplines (**Calisthenics, Gym Resistance, Weightlifting, and Taekwondo**), **Indian regional nutrition** tracking, and an **integrated Gemini AI fitness coach**.

---

## 🌟 Core Modules Built

1. **Age-Aware Onboarding (18–60+)**: Customizes routines by age band (`18-29`, `30-39`, `40-49`, `50-59`, `60+`), training experience, equipment, dietary preferences, and explicit health/clinical safety disclaimers.
2. **Executive Dashboard**: Daily session launcher, active minutes tracker, weekly volume analytics (Recharts), hydration bar, recovery readiness indicator, and personal records showcase.
3. **Training Planner & Live Workout Tracker**: Interactive session logger with sets, reps, load, RPE, rest countdown timer with sound alerts, and celebratory finish confetti.
4. **Curated Exercise Library**: 50+ movements across Calisthenics ladders (Incline push-up to L-sit pull-up), Weightlifting power lifts, Taekwondo kicks/poomsae, and hip/joint mobility routines.
5. **Indian Nutrition & Hydration Tracker**: 100+ Indian dishes (Idli, Dosa, Dal Tadka, Paneer Bhurji, Sambar, Upma, Pongal, Roti, Sprouts, Chicken Tikka, Fish, etc.) with verified ICMR-NIN nutritional estimates and household measures (katoris, rotis, cups).
6. **Taekwondo Martial Arts Curriculum**: Taegeuk forms 1–4 (WT/Kukkiwon standards), kicking pad drill loggers, belt progression tracking, and pre-sparring safety gear checklists.
7. **Progress Analytics & CNS Recovery**: Non-judgmental body weight trajectory, safe BMI screening context, 1RM tracking, and daily sleep/muscle soreness recovery logs.
8. **Integrated FitTrack AI Coach**: Natural language fitness assistant powered by Google Gemini (with an intelligent built-in heuristic offline fallback engine) for personalized workout drafting and Indian diet guidance.
9. **Cloud Supabase & Row-Level Security (RLS)**: PostgreSQL migration schemas with strict owner-only RLS policies, exportable JSON user data dumps, and account deletion pathways.

---

## 🚀 Quick Start

### 1. Install & Run Dev Server

```bash
# In the project directory:
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 2. Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Environment & Optional Integrations

FitTrack works **offline-first out of the box** without any external setup. If you wish to enable Google Gemini Flash live queries and Supabase cloud sync:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Or configure your API keys directly inside the in-app **Settings & Cloud** screen.

---

## 🛡️ Health & Medical Disclaimer

FitTrack is designed for educational fitness management and self-tracking. It does not provide medical diagnoses or prescribe clinical diets. Users experiencing dizziness, chest discomfort, acute pain, or pregnancy are instructed to cease training and seek qualified clinical guidance. Complex lifts and Taekwondo sparring require certified coach supervision and protective equipment.
