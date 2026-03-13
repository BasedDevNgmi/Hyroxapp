-- ============================================
-- HYROX 12-WEEK TRAINING PROGRAM SEED DATA
-- ============================================
-- Run this after schema.sql in the Supabase SQL Editor.
-- Matches the exact programme: 5 days/week (Mon/Tue/Wed/Fri/Sat).
-- day_number uses real day-of-week: 1=Mon, 2=Tue, 3=Wed, 5=Fri, 6=Sat.

DO $$
DECLARE
  -- Program IDs
  p1_id uuid := uuid_generate_v4();
  p2_id uuid := uuid_generate_v4();
  p3_id uuid := uuid_generate_v4();

  -- Exercise IDs
  ex_deadmill         uuid := uuid_generate_v4();
  ex_back_squat       uuid := uuid_generate_v4();
  ex_rdl              uuid := uuid_generate_v4();
  ex_bulgarian        uuid := uuid_generate_v4();
  ex_bikeerg          uuid := uuid_generate_v4();
  ex_rowerg           uuid := uuid_generate_v4();
  ex_skierg           uuid := uuid_generate_v4();
  ex_incline_walk     uuid := uuid_generate_v4();
  ex_pullups          uuid := uuid_generate_v4();
  ex_db_ohp           uuid := uuid_generate_v4();
  ex_pushups          uuid := uuid_generate_v4();
  ex_farmers_carry    uuid := uuid_generate_v4();
  ex_pogo_jumps       uuid := uuid_generate_v4();
  ex_sled_push        uuid := uuid_generate_v4();
  ex_running          uuid := uuid_generate_v4();
  ex_weighted_pullups uuid := uuid_generate_v4();
  ex_push_press       uuid := uuid_generate_v4();
  ex_burpee_broad     uuid := uuid_generate_v4();
  ex_wall_balls       uuid := uuid_generate_v4();
  ex_walking_lunges   uuid := uuid_generate_v4();
  ex_sandbag_lunges   uuid := uuid_generate_v4();

  -- Temp variables
  w_id uuid;
BEGIN

-- ============================================
-- PROGRAMS
-- ============================================
INSERT INTO public.programs (id, name, description, week_start, week_end, order_index) VALUES
  (p1_id, 'Phase 1: Base & Bulletproofing', 'Hypertrophy, Knee/Tendon strength, Zero running (low impact cardio only).', 1, 4, 1),
  (p2_id, 'Phase 2: Hyrox Strength & Threshold', 'Intro to running (Walk/Run), heavier squats, longer threshold intervals.', 5, 8, 2),
  (p3_id, 'Phase 3: Compromised Running', 'Peak Strength near 1RM, increasing running volume via Cardio Sandwiches.', 9, 12, 3);

-- ============================================
-- EXERCISES
-- ============================================
INSERT INTO public.exercises (id, name, category, description) VALUES
  (ex_deadmill,         'Deadmill Reverse Walk',   'hyrox_specific', 'Walking backwards on a turned-off treadmill or max incline. Sled drag replacement for knee protection.'),
  (ex_back_squat,       'Back Squat',              'strength',       'Barbell back squat. 1RM = 105kg.'),
  (ex_rdl,              'Romanian Deadlift (RDL)',  'strength',       'Barbell Romanian Deadlift. 1RM = 135kg.'),
  (ex_bulgarian,        'Bulgarian Split Squats',   'strength',       'Rear foot elevated split squat.'),
  (ex_bikeerg,          'BikeErg',                  'cardio',         'Concept2 BikeErg or similar stationary bike.'),
  (ex_rowerg,           'RowErg',                   'cardio',         'Concept2 RowErg or similar rowing machine.'),
  (ex_skierg,           'SkiErg',                   'cardio',         'Concept2 SkiErg.'),
  (ex_incline_walk,     'Incline Walk',             'cardio',         'Treadmill incline walking.'),
  (ex_pullups,          'Pull-ups',                 'strength',       'Bodyweight pull-ups or lat pulldowns.'),
  (ex_db_ohp,           'Seated DB Overhead Press', 'strength',       'Seated dumbbell overhead press.'),
  (ex_pushups,          'Push-ups',                 'strength',       'Bodyweight push-ups.'),
  (ex_farmers_carry,    'Farmers Carry',            'hyrox_specific', 'Heavy loaded carry with dumbbells/kettlebells.'),
  (ex_pogo_jumps,       'Pogo Jumps',               'strength',       'Quick reactive pogo-style jumps for tendon stiffness.'),
  (ex_sled_push,        'Sled Push',                'hyrox_specific', 'Weighted sled push.'),
  (ex_running,          'Running',                  'cardio',         'Running / Walk-Run intervals.'),
  (ex_weighted_pullups, 'Weighted Pull-ups',        'strength',       'Pull-ups with added weight.'),
  (ex_push_press,       'Push Press',               'strength',       'Barbell or dumbbell push press.'),
  (ex_burpee_broad,     'Burpee Broad Jumps',       'hyrox_specific', 'Burpee into a broad jump. Soft landing!'),
  (ex_wall_balls,       'Wall Balls',               'hyrox_specific', 'Medicine ball wall balls.'),
  (ex_walking_lunges,   'Walking Lunges',           'hyrox_specific', 'Bodyweight or weighted walking lunges.'),
  (ex_sandbag_lunges,   'Sandbag Lunges',           'hyrox_specific', 'Lunges carrying a sandbag.');

-- ============================================
-- PHASE 1: BASE & BULLETPROOFING (Weeks 1-4)
-- ============================================

-- ---- WEEK 1 ----
-- Monday: Lower Body Armor
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p1_id, 1, 1, 'Lower Body Armor', 'Hypertrophy & Knee Protection');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, duration_seconds, notes) VALUES
  (w_id, ex_deadmill, 1, 4, null, 60, 'Walking backwards on turned-off treadmill'),
  (w_id, ex_back_squat, 2, 4, '8', null, 'Tempo: 3 sec down, 1 sec pause at bottom');
UPDATE public.workout_exercises SET tempo = '3-1-0-0', target_weight_kg = 65 WHERE workout_id = w_id AND exercise_id = ex_back_squat;
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg, notes) VALUES
  (w_id, ex_rdl, 3, 3, '10', 85, null),
  (w_id, ex_bulgarian, 4, 3, '8 per leg', null, 'Heavy - use dumbbells');

-- Tuesday: Aerobic Engine (Zone 2)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 1, 2, 'Aerobic Engine', 'Zone 2 Cardio', 'Choose BikeErg, RowErg, or Incline Walk. Stay in Zone 2.');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, null, 2700, '45 min Zone 2. Can alternate with RowErg or Incline Walk.');

-- Wednesday: Upper Body & Grip
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p1_id, 1, 3, 'Upper Body & Grip', 'Upper Strength & Grip Endurance');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_pullups, 1, 4, '8', 'Or Lat Pulldowns'),
  (w_id, ex_db_ohp, 2, 4, '10', null),
  (w_id, ex_pushups, 3, 3, 'Max Reps', null);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, distance_meters, notes) VALUES
  (w_id, ex_farmers_carry, 4, 4, null, 40, 'Heavy as possible');

-- Friday: VO2-Max Intervals
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 1, 5, 'VO2-Max Intervals', 'Max Effort Intervals', '1 min MAX effort / 1 min rest');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
  (w_id, ex_skierg, 1, 10, null, 60, 60, '10 rounds: 1 min MAX / 1 min rest. Can alternate with RowErg.');

-- Saturday: Hyrox Simulation (AMRAP)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 1, 6, 'Hyrox Simulation', 'AMRAP Circuit', '35 min AMRAP. Complete circuit as many times as possible.');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, distance_meters, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, null, 1000, null, '1000m BikeErg'),
  (w_id, ex_sled_push, 2, 1, null, 25, null, 'Heavy sled push 25m');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, distance_meters, notes) VALUES
  (w_id, ex_rowerg, 3, 1, null, 500, '500m RowErg');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_wall_balls, 4, 1, '20', null),
  (w_id, ex_walking_lunges, 5, 1, '20', null);

-- ---- WEEK 2 ----
-- Monday: Lower Body Armor
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p1_id, 2, 1, 'Lower Body Armor', 'Hypertrophy & Knee Protection');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_deadmill, 1, 4, 75, null);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, target_weight_kg, notes) VALUES
  (w_id, ex_back_squat, 2, 4, '6', '3-1-0-0', 70, 'Tempo: 3 sec down, 1 sec pause');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_rdl, 3, 4, '8', 95);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_bulgarian, 4, 3, '8 per leg', 'Heavy - use dumbbells');

-- Tuesday: Aerobic Engine
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 2, 2, 'Aerobic Engine', 'Zone 2 Cardio', 'Choose BikeErg, RowErg, or Incline Walk.');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 3000, '50 min Zone 2');

-- Wednesday: Upper Body & Grip
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p1_id, 2, 3, 'Upper Body & Grip', 'Upper Strength & Grip Endurance');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_pullups, 1, 4, '9', null),
  (w_id, ex_db_ohp, 2, 4, '8', null),
  (w_id, ex_pushups, 3, 3, 'Max Reps', null);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_farmers_carry, 4, 5, 40, 'Heavy');

-- Friday: VO2-Max Intervals
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 2, 5, 'VO2-Max Intervals', 'Max Effort Intervals', '1 min MAX effort / 1 min rest');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes) VALUES
  (w_id, ex_skierg, 1, 12, 60, 60, '12 rounds: 1 min MAX / 1 min rest');

-- Saturday: Hyrox Simulation (AMRAP)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 2, 6, 'Hyrox Simulation', 'AMRAP Circuit', '40 min AMRAP');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 1000, '1000m BikeErg'),
  (w_id, ex_sled_push, 2, 1, 25, 'Heavy sled push'),
  (w_id, ex_rowerg, 3, 1, 500, '500m RowErg');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_wall_balls, 4, 1, '20'),
  (w_id, ex_walking_lunges, 5, 1, '20');

-- ---- WEEK 3 ----
-- Monday: Lower Body Armor
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p1_id, 3, 1, 'Lower Body Armor', 'Hypertrophy & Knee Protection');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds) VALUES
  (w_id, ex_deadmill, 1, 4, 90);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, target_weight_kg, notes) VALUES
  (w_id, ex_back_squat, 2, 5, '5', '3-1-0-0', 77.5, 'Tempo: 3 sec down, 1 sec pause');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_rdl, 3, 4, '8', 100);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_bulgarian, 4, 3, '8 per leg', 'Heavy');

-- Tuesday: Aerobic Engine
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 3, 2, 'Aerobic Engine', 'Zone 2 Cardio', 'Choose BikeErg, RowErg, or Incline Walk.');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 3600, '60 min Zone 2');

-- Wednesday: Upper Body & Grip
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p1_id, 3, 3, 'Upper Body & Grip', 'Upper Strength & Grip Endurance');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_pullups, 1, 4, '10'),
  (w_id, ex_db_ohp, 2, 5, '6');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_pushups, 3, 3, 'Max Reps', null);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_farmers_carry, 4, 6, 40, 'Heavy');

-- Friday: VO2-Max Intervals
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 3, 5, 'VO2-Max Intervals', 'Max Effort Intervals', '1 min MAX effort / 1 min rest');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes) VALUES
  (w_id, ex_skierg, 1, 15, 60, 60, '15 rounds: 1 min MAX / 1 min rest');

-- Saturday: Hyrox Simulation (AMRAP)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 3, 6, 'Hyrox Simulation', 'AMRAP Circuit', '45 min AMRAP');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 1000, '1000m BikeErg'),
  (w_id, ex_sled_push, 2, 1, 25, 'Heavy sled push'),
  (w_id, ex_rowerg, 3, 1, 500, '500m RowErg');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_wall_balls, 4, 1, '20'),
  (w_id, ex_walking_lunges, 5, 1, '20');

-- ---- WEEK 4 (DELOAD) ----
-- Monday: Lower Body Armor (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 4, 1, 'Lower Body Armor', 'Deload Week', 'Reduced volume and intensity');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds) VALUES
  (w_id, ex_deadmill, 1, 3, 60);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, target_weight_kg) VALUES
  (w_id, ex_back_squat, 2, 3, '5', '3-1-0-0', 60);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_rdl, 3, 3, '10', 70);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_bulgarian, 4, 2, '8 per leg', 'Light');

-- Tuesday: Aerobic Engine (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 4, 2, 'Aerobic Engine', 'Deload - Zone 2', 'Easy session');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 1800, '30 min Zone 2');

-- Wednesday: Upper Body & Grip (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 4, 3, 'Upper Body & Grip', 'Deload Week', 'Reduced volume');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_pullups, 1, 3, '8'),
  (w_id, ex_db_ohp, 2, 3, '10');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_pushups, 3, 2, '15', null);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters) VALUES
  (w_id, ex_farmers_carry, 4, 3, 40);

-- Friday: VO2-Max Intervals (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 4, 5, 'VO2-Max Intervals', 'Deload Intervals', 'Reduced volume, longer rest');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes) VALUES
  (w_id, ex_skierg, 1, 8, 45, 75, '8 rounds: 45 sec effort / 75 sec rest');

-- Saturday: Hyrox Simulation (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p1_id, 4, 6, 'Hyrox Simulation', 'Deload AMRAP', '25 min at 70% effort');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 1000, '1000m BikeErg at 70%'),
  (w_id, ex_sled_push, 2, 1, 25, 'Light sled push'),
  (w_id, ex_rowerg, 3, 1, 500, '500m RowErg at 70%');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_wall_balls, 4, 1, '20'),
  (w_id, ex_walking_lunges, 5, 1, '20');


-- ============================================
-- PHASE 2: HYROX STRENGTH & THRESHOLD (Weeks 5-8)
-- ============================================

-- ---- WEEK 5 ----
-- Monday: Lower Body Power
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p2_id, 5, 1, 'Lower Body Power', 'Power & Strength');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_pogo_jumps, 1, 3, '20');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters) VALUES
  (w_id, ex_sled_push, 2, 4, 20);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_back_squat, 3, 4, '5', 80),
  (w_id, ex_rdl, 4, 3, '8', 85);

-- Tuesday: Engine & Knee Test
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 5, 2, 'Engine & Knee Test', 'Cardio + Run Introduction', 'First run introduction - monitor knees');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 2400, '40 min BikeErg');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_running, 2, 1, 600, '10 min Run/Walk. Monitor knees closely.');

-- Wednesday: Upper Body & Hyrox Skills
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p2_id, 5, 3, 'Upper Body & Hyrox Skills', 'Upper Strength & Hyrox Stations');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_weighted_pullups, 1, 4, '6-8'),
  (w_id, ex_push_press, 2, 4, '6');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_burpee_broad, 3, 4, 10, 'Soft landing!'),
  (w_id, ex_farmers_carry, 4, 4, 40, 'Very heavy');

-- Friday: Lactate Threshold
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 5, 5, 'Lactate Threshold', 'Threshold Intervals', '2 min rest between blocks');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes) VALUES
  (w_id, ex_rowerg, 1, 4, 240, 120, '4x 4min blocks, 2 min rest. Can use SkiErg.');

-- Saturday: Compromised Running Sim (AMRAP)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 5, 6, 'Compromised Running Sim', 'AMRAP Circuit', '35 min AMRAP');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_running, 1, 1, 400, '400m Run'),
  (w_id, ex_sled_push, 2, 1, 25, 'Sled push 25m'),
  (w_id, ex_rowerg, 3, 1, 500, '500m RowErg');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_wall_balls, 4, 1, '20');

-- ---- WEEK 6 ----
-- Monday: Lower Body Power
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p2_id, 6, 1, 'Lower Body Power', 'Power & Strength');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_pogo_jumps, 1, 3, '20');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters) VALUES
  (w_id, ex_sled_push, 2, 5, 20);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_back_squat, 3, 4, '5', 82.5),
  (w_id, ex_rdl, 4, 3, '8', 85);

-- Tuesday: Engine & Knee Test
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p2_id, 6, 2, 'Engine & Knee Test', 'Cardio + Run');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 2100, '35 min BikeErg'),
  (w_id, ex_running, 2, 1, 900, '15 min Run/Walk');

-- Wednesday: Upper Body & Hyrox Skills
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p2_id, 6, 3, 'Upper Body & Hyrox Skills', 'Upper Strength & Hyrox Stations');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_weighted_pullups, 1, 4, '6-8'),
  (w_id, ex_push_press, 2, 4, '6');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_burpee_broad, 3, 4, 10, 'Soft landing!'),
  (w_id, ex_farmers_carry, 4, 4, 40, 'Very heavy');

-- Friday: Lactate Threshold
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 6, 5, 'Lactate Threshold', 'Threshold Intervals', '2 min rest between blocks');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes) VALUES
  (w_id, ex_rowerg, 1, 5, 240, 120, '5x 4min blocks, 2 min rest');

-- Saturday: Compromised Running Sim (AMRAP)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 6, 6, 'Compromised Running Sim', 'AMRAP Circuit', '40 min AMRAP');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_running, 1, 1, 400, '400m Run'),
  (w_id, ex_sled_push, 2, 1, 25, 'Sled push'),
  (w_id, ex_rowerg, 3, 1, 500, '500m RowErg');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_wall_balls, 4, 1, '20');

-- ---- WEEK 7 ----
-- Monday: Lower Body Power
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p2_id, 7, 1, 'Lower Body Power', 'Power & Strength');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_pogo_jumps, 1, 3, '20');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters) VALUES
  (w_id, ex_sled_push, 2, 6, 20);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_back_squat, 3, 4, '4', 85),
  (w_id, ex_rdl, 4, 3, '8', 85);

-- Tuesday: Engine & Knee Test
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p2_id, 7, 2, 'Engine & Knee Test', 'Cardio + Run');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 1800, '30 min BikeErg'),
  (w_id, ex_running, 2, 1, 1200, '20 min Run/Walk');

-- Wednesday: Upper Body & Hyrox Skills
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p2_id, 7, 3, 'Upper Body & Hyrox Skills', 'Upper Strength & Hyrox Stations');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_weighted_pullups, 1, 4, '6-8'),
  (w_id, ex_push_press, 2, 4, '6');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_burpee_broad, 3, 4, 10, 'Soft landing!'),
  (w_id, ex_farmers_carry, 4, 4, 40, 'Very heavy');

-- Friday: Lactate Threshold
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 7, 5, 'Lactate Threshold', 'Threshold Intervals', '2 min rest between blocks');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes) VALUES
  (w_id, ex_rowerg, 1, 4, 300, 120, '4x 5min blocks, 2 min rest');

-- Saturday: Compromised Running Sim (AMRAP)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 7, 6, 'Compromised Running Sim', 'AMRAP Circuit', '45 min AMRAP');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_running, 1, 1, 400, '400m Run'),
  (w_id, ex_sled_push, 2, 1, 25, 'Sled push'),
  (w_id, ex_rowerg, 3, 1, 500, '500m RowErg');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_wall_balls, 4, 1, '20');

-- ---- WEEK 8 (DELOAD) ----
-- Monday: Lower Body Power (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 8, 1, 'Lower Body Power', 'Deload Week', 'Reduced volume and intensity');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_sled_push, 1, 3, 20, 'Light sled push');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_back_squat, 2, 3, '5', 65);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_rdl, 3, 3, '8', 85);

-- Tuesday: Engine (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 8, 2, 'Engine & Knee Test', 'Deload - Bike Only', 'No running this week');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 2400, '40 min BikeErg only');

-- Wednesday: Upper Body (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 8, 3, 'Upper Body & Hyrox Skills', 'Deload Week', 'Reduced volume');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_weighted_pullups, 1, 3, '6-8'),
  (w_id, ex_push_press, 2, 3, '6');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_burpee_broad, 3, 2, 10, 'Light effort'),
  (w_id, ex_farmers_carry, 4, 3, 40, 'Moderate weight');

-- Friday: Lactate Threshold (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 8, 5, 'Lactate Threshold', 'Deload Intervals', 'Light effort');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes) VALUES
  (w_id, ex_rowerg, 1, 3, 240, 120, '3x 4min blocks, light effort');

-- Saturday: Compromised Running Sim (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p2_id, 8, 6, 'Compromised Running Sim', 'Deload AMRAP', '25 min at easy effort');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_running, 1, 1, 400, '400m easy Run'),
  (w_id, ex_sled_push, 2, 1, 25, 'Light sled push'),
  (w_id, ex_rowerg, 3, 1, 500, '500m RowErg');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_wall_balls, 4, 1, '20');


-- ============================================
-- PHASE 3: COMPROMISED RUNNING (Weeks 9-12)
-- ============================================

-- ---- WEEK 9 ----
-- Monday: Peak Strength
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p3_id, 9, 1, 'Peak Strength', 'Near-1RM Strength');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_pogo_jumps, 1, 4, '25');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_sled_push, 2, 4, 20, 'Heavy');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_back_squat, 3, 4, '4', 87.5),
  (w_id, ex_rdl, 4, 3, '8', 90);

-- Tuesday: The Cardio Sandwich
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 9, 2, 'The Cardio Sandwich', 'Bike-Run-Bike', 'Compromised running: run after bike, then finish on bike');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 900, '15 min BikeErg'),
  (w_id, ex_running, 2, 1, 900, '15 min Run'),
  (w_id, ex_bikeerg, 3, 1, 900, '15 min BikeErg');

-- Wednesday: Upper & Hyrox Specific
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p3_id, 9, 3, 'Upper & Hyrox Specific', 'Upper Strength & Hyrox Stations');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_weighted_pullups, 1, 4, '5'),
  (w_id, ex_push_press, 2, 4, '5');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_sandbag_lunges, 3, 3, 15, null),
  (w_id, ex_farmers_carry, 4, 4, 60, 'Epic carry distance');

-- Friday: Race Pace Intervals
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 9, 5, 'Race Pace Intervals', '1000m Repeats', '90 sec rest between repeats');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, rest_seconds, notes) VALUES
  (w_id, ex_rowerg, 1, 4, 1000, 90, '4x 1000m RowErg at race pace');

-- Saturday: The Marchon Sim (Rounds for Time)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 9, 6, 'The Marchon Sim', 'Rounds for Time', '3 rounds for time');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_running, 1, 3, 800, '800m Run per round'),
  (w_id, ex_sled_push, 2, 3, 25, '25m Sled Push per round');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_burpee_broad, 3, 3, 25, '25m Burpee Broad Jumps per round');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_wall_balls, 4, 3, '20', '20 Wall Balls per round');

-- ---- WEEK 10 ----
-- Monday: Peak Strength
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p3_id, 10, 1, 'Peak Strength', 'Near-1RM Strength');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_pogo_jumps, 1, 4, '25');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_sled_push, 2, 5, 20, 'Heavy');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_back_squat, 3, 4, '3', 90),
  (w_id, ex_rdl, 4, 3, '8', 90);

-- Tuesday: The Cardio Sandwich
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 10, 2, 'The Cardio Sandwich', 'Bike-Run-Bike', 'Increasing run volume');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 900, '15 min BikeErg'),
  (w_id, ex_running, 2, 1, 1200, '20 min Run'),
  (w_id, ex_bikeerg, 3, 1, 900, '15 min BikeErg');

-- Wednesday: Upper & Hyrox Specific
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p3_id, 10, 3, 'Upper & Hyrox Specific', 'Upper Strength & Hyrox Stations');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_weighted_pullups, 1, 4, '5'),
  (w_id, ex_push_press, 2, 4, '5');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters) VALUES
  (w_id, ex_sandbag_lunges, 3, 4, 15),
  (w_id, ex_farmers_carry, 4, 4, 60);

-- Friday: Race Pace Intervals
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 10, 5, 'Race Pace Intervals', '1000m Repeats', '90 sec rest');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, rest_seconds, notes) VALUES
  (w_id, ex_rowerg, 1, 5, 1000, 90, '5x 1000m RowErg at race pace');

-- Saturday: The Marchon Sim
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 10, 6, 'The Marchon Sim', 'Rounds for Time', '4 rounds for time');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_running, 1, 4, 800, '800m Run per round'),
  (w_id, ex_sled_push, 2, 4, 25, '25m Sled Push per round'),
  (w_id, ex_burpee_broad, 3, 4, 25, '25m Burpee Broad Jumps per round');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_wall_balls, 4, 4, '20', '20 Wall Balls per round');

-- ---- WEEK 11 ----
-- Monday: Peak Strength
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p3_id, 11, 1, 'Peak Strength', 'Near-1RM Strength');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_pogo_jumps, 1, 4, '25');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_sled_push, 2, 6, 20, 'Heavy');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_back_squat, 3, 3, '3', 92.5),
  (w_id, ex_rdl, 4, 3, '8', 90);

-- Tuesday: The Cardio Sandwich
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 11, 2, 'The Cardio Sandwich', 'Bike-Run-Bike', 'Peak running volume');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 600, '10 min BikeErg'),
  (w_id, ex_running, 2, 1, 1800, '30 min Run'),
  (w_id, ex_bikeerg, 3, 1, 600, '10 min BikeErg');

-- Wednesday: Upper & Hyrox Specific
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus) VALUES
  (w_id, p3_id, 11, 3, 'Upper & Hyrox Specific', 'Upper Strength & Hyrox Stations');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_weighted_pullups, 1, 4, '5'),
  (w_id, ex_push_press, 2, 4, '5');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters) VALUES
  (w_id, ex_sandbag_lunges, 3, 4, 20),
  (w_id, ex_farmers_carry, 4, 4, 60);

-- Friday: Race Pace Intervals
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 11, 5, 'Race Pace Intervals', '1000m Repeats', '90 sec rest');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, rest_seconds, notes) VALUES
  (w_id, ex_rowerg, 1, 6, 1000, 90, '6x 1000m RowErg at race pace');

-- Saturday: The Marchon Sim
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 11, 6, 'The Marchon Sim', 'Rounds for Time', '5 rounds for time');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_running, 1, 5, 800, '800m Run per round'),
  (w_id, ex_sled_push, 2, 5, 25, '25m Sled Push per round'),
  (w_id, ex_burpee_broad, 3, 5, 25, '25m Burpee Broad Jumps per round');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_wall_balls, 4, 5, '20', '20 Wall Balls per round');

-- ---- WEEK 12 (DELOAD) ----
-- Monday: Peak Strength (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 12, 1, 'Peak Strength', 'Deload Week', 'Reduced volume and intensity');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_sled_push, 1, 3, 20, 'Light sled push');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_back_squat, 2, 3, '5', 70);
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, target_weight_kg) VALUES
  (w_id, ex_rdl, 3, 3, '8', 90);

-- Tuesday: The Cardio Sandwich (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 12, 2, 'The Cardio Sandwich', 'Deload - Bike Only', 'No running this week');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, duration_seconds, notes) VALUES
  (w_id, ex_bikeerg, 1, 1, 1800, '30 min BikeErg only');

-- Wednesday: Upper & Hyrox Specific (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 12, 3, 'Upper & Hyrox Specific', 'Deload Week', 'Reduced volume');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps) VALUES
  (w_id, ex_weighted_pullups, 1, 3, '5'),
  (w_id, ex_push_press, 2, 3, '5');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_sandbag_lunges, 3, 2, 15, 'Light'),
  (w_id, ex_farmers_carry, 4, 3, 40, 'Moderate weight');

-- Friday: Race Pace Intervals (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 12, 5, 'Race Pace Intervals', 'Deload Intervals', 'Light effort');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, rest_seconds, notes) VALUES
  (w_id, ex_rowerg, 1, 3, 1000, 90, '3x 1000m RowErg, light pace');

-- Saturday: The Marchon Sim (Deload)
w_id := uuid_generate_v4();
INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes) VALUES
  (w_id, p3_id, 12, 6, 'The Marchon Sim', 'Deload', '2 rounds at easy effort');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, distance_meters, notes) VALUES
  (w_id, ex_running, 1, 2, 800, '800m easy Run per round'),
  (w_id, ex_sled_push, 2, 2, 25, '25m light Sled Push per round'),
  (w_id, ex_burpee_broad, 3, 2, 25, '25m Burpee Broad Jumps per round');
INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, notes) VALUES
  (w_id, ex_wall_balls, 4, 2, '20', '20 Wall Balls per round');

END $$;
