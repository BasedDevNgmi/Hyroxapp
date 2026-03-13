-- Hyrox Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (linked to Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  program_start_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- ============================================
-- PROGRAMS (training phases)
-- ============================================
create table public.programs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  week_start int not null,
  week_end int not null,
  order_index int not null
);

alter table public.programs enable row level security;

create policy "Programs are viewable by everyone"
  on public.programs for select
  to anon, authenticated
  using (true);

-- ============================================
-- EXERCISES (movement definitions)
-- ============================================
create table public.exercises (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('strength', 'cardio', 'mobility', 'hyrox_specific')),
  description text,
  video_url text
);

alter table public.exercises enable row level security;

create policy "Exercises are viewable by everyone"
  on public.exercises for select
  to anon, authenticated
  using (true);

-- ============================================
-- WORKOUTS (daily templates)
-- ============================================
create table public.workouts (
  id uuid primary key default uuid_generate_v4(),
  program_id uuid not null references public.programs(id) on delete cascade,
  week_number int not null,
  day_number int not null check (day_number between 1 and 7),
  name text not null,
  focus text,
  notes text,
  unique(program_id, week_number, day_number)
);

alter table public.workouts enable row level security;

create policy "Workouts are viewable by everyone"
  on public.workouts for select
  to anon, authenticated
  using (true);

create index idx_workouts_week_day on public.workouts(week_number, day_number);

-- ============================================
-- WORKOUT_EXERCISES (exercises within a workout)
-- ============================================
create table public.workout_exercises (
  id uuid primary key default uuid_generate_v4(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  order_index int not null,
  sets int not null default 3,
  reps text,
  tempo text,
  rest_seconds int,
  duration_seconds int,
  target_weight_kg decimal,
  distance_meters int,
  notes text
);

alter table public.workout_exercises enable row level security;

create policy "Workout exercises are viewable by everyone"
  on public.workout_exercises for select
  to anon, authenticated
  using (true);

create index idx_workout_exercises_workout on public.workout_exercises(workout_id);

-- ============================================
-- WORKOUT_LOGS (completed sessions)
-- ============================================
create table public.workout_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade,
  completed_at timestamptz default now() not null,
  knee_pain_level int check (knee_pain_level between 1 and 10),
  overall_rpe int check (overall_rpe between 1 and 10),
  notes text,
  duration_minutes int
);

alter table public.workout_logs enable row level security;

create policy "Users can view own workout logs"
  on public.workout_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own workout logs"
  on public.workout_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own workout logs"
  on public.workout_logs for update
  using (auth.uid() = user_id);

create index idx_workout_logs_user on public.workout_logs(user_id);
create index idx_workout_logs_workout on public.workout_logs(workout_id);

-- ============================================
-- EXERCISE_LOGS (per-set data)
-- ============================================
create table public.exercise_logs (
  id uuid primary key default uuid_generate_v4(),
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number int not null,
  weight_kg decimal,
  reps_completed int,
  time_seconds int,
  completed boolean default false,
  notes text
);

alter table public.exercise_logs enable row level security;

create policy "Users can view own exercise logs"
  on public.exercise_logs for select
  using (
    exists (
      select 1 from public.workout_logs wl
      where wl.id = exercise_logs.workout_log_id
      and wl.user_id = auth.uid()
    )
  );

create policy "Users can insert own exercise logs"
  on public.exercise_logs for insert
  with check (
    exists (
      select 1 from public.workout_logs wl
      where wl.id = exercise_logs.workout_log_id
      and wl.user_id = auth.uid()
    )
  );

create policy "Users can update own exercise logs"
  on public.exercise_logs for update
  using (
    exists (
      select 1 from public.workout_logs wl
      where wl.id = exercise_logs.workout_log_id
      and wl.user_id = auth.uid()
    )
  );

create index idx_exercise_logs_workout_log on public.exercise_logs(workout_log_id);

-- ============================================
-- PERSONAL_RECORDS (PR tracking)
-- ============================================
create table public.personal_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  value decimal not null,
  unit text not null check (unit in ('kg', 'seconds', 'meters', 'reps')),
  achieved_at timestamptz default now() not null
);

alter table public.personal_records enable row level security;

create policy "Users can view own PRs"
  on public.personal_records for select
  using (auth.uid() = user_id);

create policy "Users can insert own PRs"
  on public.personal_records for insert
  with check (auth.uid() = user_id);

create policy "Users can update own PRs"
  on public.personal_records for update
  using (auth.uid() = user_id);

create index idx_personal_records_user on public.personal_records(user_id);
create index idx_personal_records_exercise on public.personal_records(exercise_id);
