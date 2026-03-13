-- ============================================
-- HYROX 12-WEEK TRAINING PROGRAM SEED DATA
-- ============================================
-- Run this after schema.sql in the Supabase SQL Editor.
-- Uses a DO $$ block so UUID variables can wire up foreign keys.

DO $$
DECLARE
  -- Program IDs
  p1_id uuid := uuid_generate_v4();
  p2_id uuid := uuid_generate_v4();
  p3_id uuid := uuid_generate_v4();

  -- Exercise IDs
  ex_back_squat       uuid := uuid_generate_v4();
  ex_deadlift         uuid := uuid_generate_v4();
  ex_rdl              uuid := uuid_generate_v4();
  ex_bulgarian_split  uuid := uuid_generate_v4();
  ex_walking_lunges   uuid := uuid_generate_v4();
  ex_bench_press      uuid := uuid_generate_v4();
  ex_overhead_press   uuid := uuid_generate_v4();
  ex_pullups          uuid := uuid_generate_v4();
  ex_barbell_rows     uuid := uuid_generate_v4();
  ex_deadmill_walk    uuid := uuid_generate_v4();
  ex_farmers_carry    uuid := uuid_generate_v4();
  ex_wall_balls       uuid := uuid_generate_v4();
  ex_burpee_broad     uuid := uuid_generate_v4();
  ex_ski_erg          uuid := uuid_generate_v4();
  ex_rowing           uuid := uuid_generate_v4();
  ex_running_1km      uuid := uuid_generate_v4();
  ex_box_jumps        uuid := uuid_generate_v4();
  ex_plank            uuid := uuid_generate_v4();
  ex_hip_flexor       uuid := uuid_generate_v4();

  -- Workout IDs (w_pX_wY_dZ = program X, week Y, day Z)
  w_id uuid;

  -- Temp variable for workout_exercise inserts
  we_id uuid;

  -- Loop variables
  v_week int;
  v_program_id uuid;
  v_sets int;
  v_reps text;
  v_intensity text;
  v_notes text;
  v_deload boolean;
  v_light boolean;

BEGIN
  -- ==========================================
  -- INSERT PROGRAMS
  -- ==========================================
  INSERT INTO public.programs (id, name, description, week_start, week_end, order_index) VALUES
    (p1_id, 'Phase 1: Foundation',
     'Build aerobic base and movement quality. Moderate volume at controlled tempos. Focus on form, joint health, and establishing training rhythm.',
     1, 4, 1),
    (p2_id, 'Phase 2: Build',
     'Increase intensity and specificity. Heavier loads, longer intervals, and more Hyrox-specific conditioning. Push strength numbers up.',
     5, 8, 2),
    (p3_id, 'Phase 3: Peak & Taper',
     'Peak fitness in weeks 9-11 with highest intensity. Week 12 is a full deload to arrive fresh on race day.',
     9, 12, 3);

  -- ==========================================
  -- INSERT EXERCISES
  -- ==========================================
  INSERT INTO public.exercises (id, name, category, description, video_url) VALUES
    (ex_back_squat,      'Back Squat',              'strength',       'Barbell back squat with controlled tempo. Start at 105kg and progress. Focus on depth and knee tracking.', NULL),
    (ex_deadlift,        'Deadlift',                'strength',       'Conventional barbell deadlift. Brace hard, hinge at hips, drive through the floor.', NULL),
    (ex_rdl,             'Romanian Deadlift',       'strength',       'Barbell RDL for posterior chain. Keep slight knee bend, hinge until hamstring stretch, squeeze glutes at top.', NULL),
    (ex_bulgarian_split, 'Bulgarian Split Squat',   'strength',       'Rear foot elevated split squat with dumbbells. Great for single-leg strength and knee stability.', NULL),
    (ex_walking_lunges,  'Walking Lunges',          'strength',       'Dumbbell walking lunges. Long stride, upright torso, drive through front heel.', NULL),
    (ex_bench_press,     'Bench Press',             'strength',       'Barbell bench press. Arch back, retract scapulae, control the eccentric.', NULL),
    (ex_overhead_press,  'Overhead Press',          'strength',       'Standing barbell overhead press. Brace core, press to full lockout overhead.', NULL),
    (ex_pullups,         'Pull-ups',                'strength',       'Strict pull-ups from dead hang. Add weight via belt when bodyweight becomes easy.', NULL),
    (ex_barbell_rows,    'Barbell Rows',            'strength',       'Bent-over barbell row. Hinge to ~45 degrees, pull bar to lower sternum, squeeze shoulder blades.', NULL),
    (ex_deadmill_walk,   'Deadmill Reverse Walk',   'hyrox_specific', 'Walk backwards on an unpowered treadmill pushing against the belt. Replaces sled push/drag for gym training.', NULL),
    (ex_farmers_carry,   'Farmers Carry',           'hyrox_specific', 'Heavy dumbbell or kettlebell carry. Grip hard, shoulders packed, brisk walking pace.', NULL),
    (ex_wall_balls,      'Wall Balls',              'hyrox_specific', 'Squat to wall ball throw at 3m target. Use 6-9kg med ball. Full squat depth on every rep.', NULL),
    (ex_burpee_broad,    'Burpee Broad Jumps',      'hyrox_specific', 'Burpee into a max-effort broad jump forward. Chest must touch the floor on each rep.', NULL),
    (ex_ski_erg,         'Ski Erg',                 'cardio',         'Ski ergometer for upper body and full-body cardio. Hinge at hips, powerful pull with arms and core.', NULL),
    (ex_rowing,          'Rowing',                  'cardio',         'Rowing ergometer. Drive with legs first, then lean back, then pull arms. Aim for consistent split times.', NULL),
    (ex_running_1km,     'Running (1km)',            'cardio',         '1km run effort. Pace depends on context: easy, threshold, or race-pace depending on the session.', NULL),
    (ex_box_jumps,       'Box Jumps',               'strength',       'Jump onto a box (60-75cm). Land softly with full hip extension at top. Step down to save joints.', NULL),
    (ex_plank,           'Plank',                   'mobility',       'Front plank hold. Squeeze glutes, brace abs, keep body in a straight line. Build core endurance.', NULL),
    (ex_hip_flexor,      'Hip Flexor Stretch',      'mobility',       'Half-kneeling hip flexor stretch. Hold 45-60s each side. Squeeze glute of the rear leg to deepen stretch.', NULL);

  -- ==========================================
  -- INSERT WORKOUTS AND WORKOUT_EXERCISES
  -- ==========================================
  -- Strategy: loop through all 12 weeks, determine the program and
  -- prescription (sets/reps/notes) based on phase and deload status,
  -- then insert 5 workouts per week with appropriate exercises.

  FOR v_week IN 1..12 LOOP

    -- Determine which program this week belongs to
    IF v_week <= 4 THEN
      v_program_id := p1_id;
    ELSIF v_week <= 8 THEN
      v_program_id := p2_id;
    ELSE
      v_program_id := p3_id;
    END IF;

    -- Determine loading scheme
    v_deload := (v_week = 12);
    v_light  := (v_week IN (4, 8));

    -- ========================================
    -- DAY 1: STRENGTH A (Lower Body)
    -- ========================================
    w_id := uuid_generate_v4();

    IF v_deload THEN
      v_notes := 'DELOAD WEEK - light loads, focus on movement quality and recovery.';
    ELSIF v_light THEN
      v_notes := 'Light week - reduce 1 set from normal prescription. Stay controlled.';
    ELSIF v_week <= 4 THEN
      v_notes := 'Foundation phase - prioritize tempo and depth over load.';
    ELSIF v_week <= 8 THEN
      v_notes := 'Build phase - push loads up while maintaining form.';
    ELSE
      v_notes := 'Peak phase - highest intensity of the block. Earn every rep.';
    END IF;

    INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes)
    VALUES (w_id, v_program_id, v_week, 1,
            'Strength A: Lower Body',
            'Squat pattern, single-leg work, posterior chain',
            v_notes);

    -- Back Squat
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_back_squat, 1, 2, '8', '3-1-1-0', 120, 'Deload: ~70kg (65%). Smooth and controlled.');
    ELSIF v_light THEN
      IF v_week = 4 THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_back_squat, 1, 3, '8', '3-1-1-0', 120, 'Light week: 105kg. Drop 1 set from normal.');
      ELSE
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_back_squat, 1, 3, '6', '3-1-1-0', 150, 'Light week: 112.5kg. Drop 1 set from normal.');
      END IF;
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_back_squat, 1, 4, '8', '3-1-1-0', 120, '105kg starting weight. Full depth, control the eccentric.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_back_squat, 1, 4, '6', '3-1-1-0', 150, '112.5-117.5kg. Heavier load, fewer reps.');
    ELSIF v_week <= 10 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_back_squat, 1, 5, '5', '3-1-1-0', 180, '120-125kg. Peak loading. Grind if needed.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_back_squat, 1, 4, '5', '2-1-1-0', 150, '117.5kg. Maintain intensity, slightly less volume pre-taper.');
    END IF;

    -- Bulgarian Split Squat
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bulgarian_split, 2, 2, '8 each leg', '2-0-1-0', 90, 'Deload: bodyweight or light DBs only.');
    ELSIF v_light THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bulgarian_split, 2, 2, '10 each leg', '2-0-1-0', 90, 'Light week: moderate DBs.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bulgarian_split, 2, 3, '10 each leg', '2-0-1-0', 90, '16-20kg DBs. Control the descent.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bulgarian_split, 2, 3, '8 each leg', '2-0-1-0', 90, '22-26kg DBs. Push the load.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bulgarian_split, 2, 4, '6 each leg', '2-0-1-0', 90, '26-30kg DBs. Strong single-leg work.');
    END IF;

    -- Romanian Deadlift
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_rdl, 3, 2, '10', '3-0-1-0', 90, 'Deload: ~60kg. Feel the hamstrings, no grinding.');
    ELSIF v_light THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_rdl, 3, 2, '10', '3-0-1-0', 90, 'Light week: ~80kg.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_rdl, 3, 3, '10', '3-0-1-0', 90, '80-90kg. Slow eccentric, feel the stretch.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_rdl, 3, 4, '8', '3-0-1-0', 90, '95-100kg. Keep back flat.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_rdl, 3, 4, '6', '3-0-1-0', 120, '100-110kg. Heavy but controlled.');
    END IF;

    -- Walking Lunges
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_walking_lunges, 4, 2, '12 each leg', NULL, 60, 'Deload: bodyweight only. Long strides.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_walking_lunges, 4, 3, '12 each leg', NULL, 60, '12-16kg DBs. Upright torso.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_walking_lunges, 4, 3, '10 each leg', NULL, 60, '20-24kg DBs. Drive through front heel.');
    END IF;

    -- Plank finisher
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_plank, 5, 2, NULL, NULL, 60, 30, 'Deload: easy holds.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_plank, 5, 3, NULL, NULL, 60, 45, 'Squeeze everything. Build to 60s holds.');
    END IF;

    -- ========================================
    -- DAY 2: AEROBIC ENGINE
    -- ========================================
    w_id := uuid_generate_v4();

    IF v_deload THEN
      v_notes := 'DELOAD - Easy aerobic work. Keep heart rate in Zone 2. Enjoy the movement.';
    ELSIF v_week <= 4 THEN
      v_notes := 'Build aerobic base. Consistent pacing, nothing redline.';
    ELSIF v_week <= 8 THEN
      v_notes := 'Push threshold intervals. Get comfortable being uncomfortable.';
    ELSE
      v_notes := 'Race-pace efforts. Practice hitting splits you want on race day.';
    END IF;

    INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes)
    VALUES (w_id, v_program_id, v_week, 2,
            'Aerobic Engine',
            'Running intervals, rowing, ski erg conditioning',
            v_notes);

    -- Running intervals
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_running_1km, 1, 2, '1km', NULL, 180, NULL, 'Easy pace 1km repeats. ~5:30-6:00/km. Conversational.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_running_1km, 1, 4, '1km', NULL, 120, NULL, 'Run at ~5:00/km pace. Focus on breathing rhythm.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_running_1km, 1, 5, '1km', NULL, 90, NULL, 'Push to ~4:45/km. Shorter rest, build lactate tolerance.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_running_1km, 1, 6, '1km', NULL, 75, NULL, 'Race pace ~4:30-4:40/km. This is what race day feels like.');
    END IF;

    -- Rowing
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_rowing, 2, 1, NULL, NULL, NULL, 600, 'Easy 10 min row. ~2:10/500m split. Zone 2.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_rowing, 2, 3, NULL, NULL, 120, 300, '3x5 min at ~2:00/500m. Steady state effort.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_rowing, 2, 4, NULL, NULL, 90, 300, '4x5 min at ~1:55/500m. Push the pace.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_rowing, 2, 4, NULL, NULL, 60, 300, '4x5 min at sub-1:50/500m. Race intensity.');
    END IF;

    -- Ski Erg
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_ski_erg, 3, 1, NULL, NULL, NULL, 600, 'Easy 10 min ski. Light effort, loosen up the shoulders.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_ski_erg, 3, 3, NULL, NULL, 90, 180, '3x3 min intervals. Strong pulls, full extension.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_ski_erg, 3, 4, NULL, NULL, 60, 180, '4x3 min. Fight the fade in the last minute.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_ski_erg, 3, 5, NULL, NULL, 60, 120, '5x2 min max effort. Simulate race-station effort.');
    END IF;

    -- ========================================
    -- DAY 3: STRENGTH B (Upper + Posterior)
    -- ========================================
    w_id := uuid_generate_v4();

    IF v_deload THEN
      v_notes := 'DELOAD - Upper body. Light weights, full ROM, leave feeling refreshed.';
    ELSIF v_week <= 4 THEN
      v_notes := 'Foundation pressing and pulling. Build balanced upper body strength.';
    ELSIF v_week <= 8 THEN
      v_notes := 'Push the pressing numbers. Pull-ups: add weight if possible.';
    ELSE
      v_notes := 'Peak upper body strength. Heavy compounds, low volume.';
    END IF;

    INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes)
    VALUES (w_id, v_program_id, v_week, 3,
            'Strength B: Upper + Posterior',
            'Press, pull, row, deadlift',
            v_notes);

    -- Deadlift
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_deadlift, 1, 2, '6', '2-0-1-0', 120, 'Deload: ~100kg (60%). Crisp singles-feel reps.');
    ELSIF v_light THEN
      IF v_week = 4 THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_deadlift, 1, 3, '6', '2-0-1-0', 120, 'Light week: ~130kg. Drop 1 set.');
      ELSE
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_deadlift, 1, 3, '5', '1-0-1-0', 150, 'Light week: ~145kg. Drop 1 set.');
      END IF;
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_deadlift, 1, 4, '6', '2-0-1-0', 120, '130-140kg. Brace belt-less if possible for foundation work.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_deadlift, 1, 4, '5', '1-0-1-0', 150, '145-155kg. Belt up. Drive through the floor.');
    ELSIF v_week <= 10 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_deadlift, 1, 5, '3', '1-0-1-0', 180, '160-170kg. Peak deadlift numbers. Full rest between sets.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_deadlift, 1, 4, '4', '1-0-1-0', 150, '150kg. Maintain, dont push into taper.');
    END IF;

    -- Bench Press
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bench_press, 2, 2, '8', '2-1-1-0', 90, 'Deload: ~60kg. Light and snappy.');
    ELSIF v_light THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bench_press, 2, 3, '8', '2-1-1-0', 90, 'Light week. Back off ~10% from working weight.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bench_press, 2, 4, '8', '2-1-1-0', 90, '75-80kg. Touch chest every rep, controlled eccentric.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bench_press, 2, 4, '6', '2-1-1-0', 120, '85-90kg. Heavier pressing.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_bench_press, 2, 5, '5', '2-1-1-0', 120, '90-95kg. Peak bench numbers.');
    END IF;

    -- Pull-ups
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_pullups, 3, 2, '6', '2-0-1-0', 90, 'Deload: bodyweight only. Smooth reps.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_pullups, 3, 4, '8', '2-0-1-0', 90, 'Bodyweight. Dead hang start every rep. Add band if needed.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_pullups, 3, 4, '6', '2-0-1-0', 90, 'Add 5-10kg via belt. Full ROM.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_pullups, 3, 4, '5', '2-0-1-0', 120, 'Add 10-15kg. Weighted pull-up strength.');
    END IF;

    -- Barbell Rows
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_barbell_rows, 4, 2, '10', '2-0-1-1', 60, 'Deload: ~50kg. Squeeze at top.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_barbell_rows, 4, 3, '10', '2-0-1-1', 90, '70-75kg. Pull to lower sternum, squeeze the contraction.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_barbell_rows, 4, 4, '8', '2-0-1-1', 90, '80-85kg. Stay strict, no heaving.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_barbell_rows, 4, 4, '6', '2-0-1-0', 90, '85-90kg. Heavy rows, some body English OK.');
    END IF;

    -- Overhead Press
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_overhead_press, 5, 2, '8', '2-0-1-0', 60, 'Deload: ~30kg. Easy pressing.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_overhead_press, 5, 3, '8', '2-0-1-0', 90, '45-50kg. Strict press, no leg drive.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_overhead_press, 5, 3, '6', '2-0-1-0', 90, '52.5-57.5kg. Grind it out.');
    END IF;

    -- Hip Flexor Stretch finisher
    INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
    VALUES (w_id, ex_hip_flexor, 6, 2, '45s each side', NULL, 30, 45, 'Half-kneeling stretch. Squeeze rear glute. Breathe deep.');

    -- ========================================
    -- DAY 4: HYROX SPECIFIC
    -- ========================================
    w_id := uuid_generate_v4();

    IF v_deload THEN
      v_notes := 'DELOAD - Practice the movements at low intensity. Stay sharp without accumulating fatigue.';
    ELSIF v_week <= 4 THEN
      v_notes := 'Learn the Hyrox stations. Focus on technique and pacing strategy.';
    ELSIF v_week <= 8 THEN
      v_notes := 'Push station intensity. Simulate race conditions with minimal rest.';
    ELSE
      v_notes := 'Full race simulation pace. Transition speed matters as much as station work.';
    END IF;

    INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes)
    VALUES (w_id, v_program_id, v_week, 4,
            'Hyrox Specific',
            'Deadmill walk, farmers carry, wall balls, burpee broad jumps',
            v_notes);

    -- Deadmill Reverse Walk
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_deadmill_walk, 1, 2, NULL, NULL, 120, 60, 'Deload: 2x1 min easy. Light resistance.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_deadmill_walk, 1, 3, NULL, NULL, 120, 90, '3x90s. Moderate resistance. Find your rhythm.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_deadmill_walk, 1, 4, NULL, NULL, 90, 90, '4x90s. Increase resistance. Push hard.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_deadmill_walk, 1, 4, NULL, NULL, 60, 120, '4x2 min. Race-pace resistance. Do not stop.');
    END IF;

    -- Farmers Carry
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_farmers_carry, 2, 2, '40m', NULL, 90, 'Deload: 24kg each hand. Brisk walk.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_farmers_carry, 2, 3, '50m', NULL, 90, '32kg each hand. Grip hard, walk fast.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_farmers_carry, 2, 4, '50m', NULL, 60, '36-40kg each hand. No putting down. If grip fails, build it.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_farmers_carry, 2, 4, '75m', NULL, 60, '40kg each hand. Race distance carry. Jog-pace.');
    END IF;

    -- Wall Balls
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_wall_balls, 3, 2, '15', NULL, 90, 'Deload: 6kg ball. Easy, find your rhythm.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_wall_balls, 3, 3, '20', NULL, 90, '6kg ball to 3m target. Full squat depth every rep.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_wall_balls, 3, 4, '25', NULL, 60, '9kg ball. Unbroken is the goal. Breathe at the top.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_wall_balls, 3, 3, '30', NULL, 45, '9kg ball. 100 reps total strategy: 30-30-25-15 or unbroken.');
    END IF;

    -- Burpee Broad Jumps
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_burpee_broad, 4, 2, '5', NULL, 120, 'Deload: easy pace. Focus on jump distance.');
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_burpee_broad, 4, 3, '8', NULL, 120, 'Chest to floor, max jump forward. Pace yourself.');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_burpee_broad, 4, 4, '10', NULL, 90, 'Push the volume. This station breaks people on race day.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_burpee_broad, 4, 4, '12', NULL, 60, 'Race simulation: 80m worth of jumps. Minimal rest.');
    END IF;

    -- Box Jumps (accessory)
    IF NOT v_deload THEN
      IF v_week <= 4 THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_box_jumps, 5, 3, '8', NULL, 60, '60cm box. Soft landings, step down. Build explosiveness.');
      ELSE
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_box_jumps, 5, 3, '6', NULL, 60, '75cm box. Explosive hip extension. Step down always.');
      END IF;
    END IF;

    -- ========================================
    -- DAY 5: COMPROMISED RUNNING
    -- ========================================
    w_id := uuid_generate_v4();

    IF v_deload THEN
      v_notes := 'DELOAD - Light station work into easy 1km. Just move and enjoy.';
    ELSIF v_week <= 4 THEN
      v_notes := 'Learn to run on tired legs. The key Hyrox skill. Do NOT rest between station and run.';
    ELSIF v_week <= 8 THEN
      v_notes := 'Push the station harder, then try to hold run pace. Embrace the suffering.';
    ELSE
      v_notes := 'Full race simulation: hit the station hard, immediately run 1km at target pace. No excuses.';
    END IF;

    INSERT INTO public.workouts (id, program_id, week_number, day_number, name, focus, notes)
    VALUES (w_id, v_program_id, v_week, 5,
            'Compromised Running',
            'Strength station immediately followed by 1km run',
            v_notes);

    -- The "station" exercise rotates by week to simulate different race pairings
    -- Weeks 1,5,9: Wall Balls -> Run
    -- Weeks 2,6,10: Farmers Carry -> Run
    -- Weeks 3,7,11: Deadmill Walk -> Run
    -- Weeks 4,8,12: Burpee Broad Jumps -> Run (lighter on deload/light weeks)

    IF v_week % 4 = 1 THEN
      -- Wall Balls -> Run
      IF v_deload THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_wall_balls, 1, 2, '15', NULL, 0, 'Light wall balls then immediately run.');
      ELSIF v_week <= 4 THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_wall_balls, 1, 3, '20', NULL, 0, '6kg ball. Go straight into the run. No rest.');
      ELSIF v_week <= 8 THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_wall_balls, 1, 3, '25', NULL, 0, '9kg ball. Higher reps, then run hard.');
      ELSE
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_wall_balls, 1, 3, '30', NULL, 0, 'Race simulation: full 100 wall balls broken into 3 sets, run between sets.');
      END IF;

    ELSIF v_week % 4 = 2 THEN
      -- Farmers Carry -> Run
      IF v_deload THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_farmers_carry, 1, 2, '40m', NULL, 0, 'Light carry then run.');
      ELSIF v_week <= 4 THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_farmers_carry, 1, 3, '50m', NULL, 0, '32kg each hand. Drop and go run immediately.');
      ELSIF v_week <= 8 THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_farmers_carry, 1, 3, '75m', NULL, 0, '36kg each hand. Arms will be dead, run anyway.');
      ELSE
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_farmers_carry, 1, 3, '75m', NULL, 0, '40kg each hand. Race-weight carry into race-pace run.');
      END IF;

    ELSIF v_week % 4 = 3 THEN
      -- Deadmill Walk -> Run
      IF v_deload THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
        VALUES (w_id, ex_deadmill_walk, 1, 2, NULL, NULL, 0, 60, 'Light deadmill then run.');
      ELSIF v_week <= 4 THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
        VALUES (w_id, ex_deadmill_walk, 1, 3, NULL, NULL, 0, 90, 'Moderate resistance. Legs will be heavy for the run.');
      ELSIF v_week <= 8 THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
        VALUES (w_id, ex_deadmill_walk, 1, 3, NULL, NULL, 0, 120, 'Heavy resistance. Push hard then suffer on the run.');
      ELSE
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
        VALUES (w_id, ex_deadmill_walk, 1, 3, NULL, NULL, 0, 120, 'Race-pace deadmill. Quads will scream. Run through it.');
      END IF;

    ELSE
      -- v_week % 4 = 0: Burpee Broad Jumps -> Run (weeks 4, 8, 12)
      IF v_deload THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_burpee_broad, 1, 2, '5', NULL, 0, 'Deload: easy burpee broad jumps then jog.');
      ELSIF v_light THEN
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_burpee_broad, 1, 2, '8', NULL, 0, 'Light week: fewer sets, then run at moderate effort.');
      ELSE
        INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
        VALUES (w_id, ex_burpee_broad, 1, 3, '10', NULL, 0, 'Burpee broad jumps then straight into the run.');
      END IF;
    END IF;

    -- 1km Run (always follows the station)
    IF v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_running_1km, 2, 1, '1km', NULL, 180, 'Easy jog. ~6:00/km. Just move.');
      -- Only 1 round on deload
    ELSIF v_week <= 4 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_running_1km, 2, 3, '1km', NULL, 180, 'Run at ~5:15/km immediately after station. 3 rounds total (station->run->station->run->station->run).');
    ELSIF v_week <= 8 THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_running_1km, 2, 3, '1km', NULL, 120, 'Push to ~5:00/km on tired legs. Shorter recovery between rounds.');
    ELSE
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, notes)
      VALUES (w_id, ex_running_1km, 2, 4, '1km', NULL, 90, 'Race pace ~4:40/km. 4 rounds. This is the hardest session of the week.');
    END IF;

    -- Plank finisher (not on deload)
    IF NOT v_deload THEN
      INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, sets, reps, tempo, rest_seconds, duration_seconds, notes)
      VALUES (w_id, ex_plank, 3, 3, NULL, NULL, 30, 45, 'Core finisher after compromised running. Hold tight.');
    END IF;

  END LOOP;

  -- Log success
  RAISE NOTICE '12-week Hyrox training program seeded: 3 programs, 19 exercises, 60 workouts.';

END $$;
