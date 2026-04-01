import type { Exercise } from '@/hooks/useProgram'

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE DATABASE
// Each exercise has a `log` config that is the single source of truth for:
//   type        — which inputs are shown when logging a set
//   weight_step — kg increment on the weight stepper (0 = no weight field)
//   time_step   — seconds increment on the time stepper  (0 = no time field)
//
// Input types:
//   weight_reps — kg stepper + reps stepper (barbell, DB, cable, machine)
//   reps_only   — reps stepper only (bodyweight exercises)
//   time        — time stepper only (holds, cardio intervals)
//   distance    — time stepper as proxy for effort (legacy, rarely used)
//   check_only  — just a checkmark (prehab drills, strides)
// ─────────────────────────────────────────────────────────────────────────────

export const exercises: Record<string, Exercise> = {

  // ── Strength: Lower ─────────────────────────────────────────────────────────
  back_squat:       { id: 'ex-back-squat',       name: 'Back Squat',                   category: 'strength',       description: 'Barbell back squat — the king of lower body.',                          video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  front_squat:      { id: 'ex-front-squat',      name: 'Front Squat',                  category: 'strength',       description: 'Barbell front squat — quad dominant, core intensive.',                  video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  pause_squat:      { id: 'ex-pause-squat',      name: 'Pause Squat',                  category: 'strength',       description: 'Back squat with 2-sec pause at the bottom.',                            video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  tempo_squat:      { id: 'ex-tempo-squat',      name: 'Tempo Squat',                  category: 'strength',       description: 'Back squat with controlled eccentric (4 sec down).',                    video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  rdl:              { id: 'ex-rdl',              name: 'Romanian Deadlift (RDL)',       category: 'strength',       description: 'Barbell RDL — hamstrings + posterior chain.',                           video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  deadlift:         { id: 'ex-deadlift',         name: 'Deadlift',                     category: 'strength',       description: 'Conventional barbell deadlift.',                                        video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  deficit_deadlift: { id: 'ex-deficit-dl',       name: 'Deficit Deadlift',             category: 'strength',       description: 'Deadlift standing on a plate for increased ROM.',                       video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  pause_deadlift:   { id: 'ex-pause-dl',         name: 'Pause Deadlift',               category: 'strength',       description: 'Deadlift with 2-sec pause at knee height.',                             video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  bulgarian:        { id: 'ex-bulgarian',        name: 'Bulgarian Split Squat',        category: 'strength',       description: 'Rear foot elevated split squat — single leg strength.',                  video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  leg_press:        { id: 'ex-leg-press',        name: 'Leg Press',                    category: 'strength',       description: 'Machine leg press — hypertrophy volume.',                               video_url: null, log: { type: 'weight_reps', weight_step: 5,   time_step: 0 } },
  leg_curl:         { id: 'ex-leg-curl',         name: 'Leg Curl',                     category: 'strength',       description: 'Machine hamstring curl.',                                               video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  leg_extension:    { id: 'ex-leg-ext',          name: 'Leg Extension',                category: 'strength',       description: 'Machine quad extension.',                                               video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  hip_thrust:       { id: 'ex-hip-thrust',       name: 'Hip Thrust',                   category: 'strength',       description: 'Barbell hip thrust — glute dominant.',                                  video_url: null, log: { type: 'weight_reps', weight_step: 5,   time_step: 0 } },
  ghr:              { id: 'ex-ghr',              name: 'GHR / Nordic Curl',            category: 'strength',       description: 'Glute-ham raise or Nordic hamstring curl — bodyweight.',                video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },

  // ── Strength: Upper ─────────────────────────────────────────────────────────
  bench_press:      { id: 'ex-bench',            name: 'Bench Press',                  category: 'strength',       description: 'Barbell flat bench press.',                                             video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  ohp:              { id: 'ex-ohp',              name: 'Overhead Press (OHP)',          category: 'strength',       description: 'Standing barbell overhead press.',                                      video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  barbell_row:      { id: 'ex-bb-row',           name: 'Barbell Row',                  category: 'strength',       description: 'Bent-over barbell row.',                                                video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  pendlay_row:      { id: 'ex-pendlay',          name: 'Pendlay Row',                  category: 'strength',       description: 'Strict barbell row from the floor each rep.',                           video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  pullups:          { id: 'ex-pullups',          name: 'Pull-ups',                     category: 'strength',       description: 'Bodyweight pull-ups.',                                                  video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
  weighted_pullups: { id: 'ex-weighted-pullups', name: 'Weighted Pull-ups',            category: 'strength',       description: 'Pull-ups with added weight (belt or dumbbell).',                        video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  db_incline_press: { id: 'ex-db-incline',       name: 'DB Incline Press',             category: 'strength',       description: 'Dumbbell incline bench press.',                                         video_url: null, log: { type: 'weight_reps', weight_step: 1,   time_step: 0 } },
  cable_row:        { id: 'ex-cable-row',        name: 'Cable Row',                    category: 'strength',       description: 'Seated cable row.',                                                     video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  chest_supported:  { id: 'ex-chest-row',        name: 'Chest Supported Row',          category: 'strength',       description: 'Chest supported dumbbell or machine row.',                              video_url: null, log: { type: 'weight_reps', weight_step: 1,   time_step: 0 } },
  db_lateral_raise: { id: 'ex-lat-raise',        name: 'DB Lateral Raise',             category: 'strength',       description: 'Dumbbell lateral raise for shoulders.',                                 video_url: null, log: { type: 'weight_reps', weight_step: 1,   time_step: 0 } },
  cable_lat_raise:  { id: 'ex-cable-lat',        name: 'Cable Lateral Raise',          category: 'strength',       description: 'Cable lateral raise.',                                                  video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  face_pulls:       { id: 'ex-face-pulls',       name: 'Face Pulls',                   category: 'strength',       description: 'Cable face pulls — rear delt and rotator cuff health.',                 video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  db_flye:          { id: 'ex-db-flye',          name: 'DB Flye',                      category: 'strength',       description: 'Dumbbell chest flye.',                                                  video_url: null, log: { type: 'weight_reps', weight_step: 1,   time_step: 0 } },
  push_press:       { id: 'ex-push-press',       name: 'Push Press',                   category: 'strength',       description: 'Barbell push press — leg drive into overhead.',                         video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },

  // ── Arms ────────────────────────────────────────────────────────────────────
  barbell_curl:     { id: 'ex-bb-curl',          name: 'Barbell Curl',                 category: 'arms',           description: 'Standing barbell bicep curl.',                                          video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  ez_curl:          { id: 'ex-ez-curl',          name: 'EZ Curl',                      category: 'arms',           description: 'EZ bar bicep curl.',                                                    video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  hammer_curl:      { id: 'ex-hammer-curl',      name: 'Hammer Curl',                  category: 'arms',           description: 'Dumbbell hammer curl — brachialis focus.',                              video_url: null, log: { type: 'weight_reps', weight_step: 1,   time_step: 0 } },
  tricep_dips:      { id: 'ex-tricep-dips',      name: 'Tricep Dips',                  category: 'arms',           description: 'Parallel bar or bench dips — bodyweight.',                              video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
  skull_crusher:    { id: 'ex-skull-crush',      name: 'Skull Crusher',                category: 'arms',           description: 'Lying EZ bar tricep extension.',                                        video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  overhead_tricep:  { id: 'ex-oh-tricep',        name: 'Overhead Tricep Extension',    category: 'arms',           description: 'Cable or dumbbell overhead tricep extension.',                          video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },

  // ── Core ────────────────────────────────────────────────────────────────────
  ab_wheel:         { id: 'ex-ab-wheel',         name: 'Ab Wheel Rollout',             category: 'core',           description: 'Ab wheel rollout from knees or standing.',                              video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
  pallof_press:     { id: 'ex-pallof',           name: 'Pallof Press',                 category: 'core',           description: 'Cable Pallof press — anti-rotation core.',                              video_url: null, log: { type: 'weight_reps', weight_step: 2.5, time_step: 0 } },
  dead_bug:         { id: 'ex-dead-bug',         name: 'Dead Bug',                     category: 'core',           description: 'Dead bug — contralateral limb extension for core stability.',            video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
  dragon_flag:      { id: 'ex-dragon-flag',      name: 'Dragon Flag',                  category: 'core',           description: 'Advanced core lever — bodyweight.',                                     video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
  hanging_knee:     { id: 'ex-hang-knee',        name: 'Hanging Knee Raise',           category: 'core',           description: 'Hanging knee raise from a pull-up bar.',                                video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
  side_plank:       { id: 'ex-side-plank',       name: 'Side Plank',                   category: 'core',           description: 'Side plank hold — lateral core stability. Log seconds per side.',       video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 5 } },
  copenhagen:       { id: 'ex-copenhagen',       name: 'Copenhagen Adductor',          category: 'core',           description: 'Copenhagen plank — adductor strength and injury prevention.',            video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },

  // ── Prehab ──────────────────────────────────────────────────────────────────
  foam_roll:        { id: 'ex-foam-roll',        name: 'Foam Roll IT-Band + Calves',   category: 'prehab',         description: 'Foam roll IT-band and calves, 2 min per side.',                         video_url: null, log: { type: 'check_only',  weight_step: 0,   time_step: 0 } },
  banded_clamshell: { id: 'ex-clamshell',        name: 'Banded Clamshells',            category: 'prehab',         description: 'Banded clamshells — gluteus medius activation.',                        video_url: null, log: { type: 'check_only',  weight_step: 0,   time_step: 0 } },
  eccentric_calf:   { id: 'ex-ecc-calf',         name: 'Eccentric Calf Raise',         category: 'prehab',         description: 'Slow eccentric calf raise from a step.',                                video_url: null, log: { type: 'check_only',  weight_step: 0,   time_step: 0 } },
  ankle_mobility:   { id: 'ex-ankle-mob',        name: 'Ankle Mobility',               category: 'prehab',         description: 'Knee-over-toe against wall, 2×20 per side.',                            video_url: null, log: { type: 'check_only',  weight_step: 0,   time_step: 0 } },
  sl_glute_bridge:  { id: 'ex-sl-bridge',        name: 'Single-Leg Glute Bridge',      category: 'prehab',         description: 'Single-leg glute bridge for glute activation.',                         video_url: null, log: { type: 'check_only',  weight_step: 0,   time_step: 0 } },

  // ── Grip ────────────────────────────────────────────────────────────────────
  plate_pinch:      { id: 'ex-plate-pinch',      name: 'Plate Pinch',                  category: 'grip',           description: 'Pinch grip plate hold for time. Log seconds held.',                     video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 5 } },
  towel_hang:       { id: 'ex-towel-hang',       name: 'Towel Hang',                   category: 'grip',           description: 'Dead hang from a towel draped over bar. Log seconds.',                  video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 5 } },
  fat_grip_hang:    { id: 'ex-fat-hang',         name: 'Fat Grip Hang',                category: 'grip',           description: 'Dead hang with fat gripz or thick bar. Log seconds.',                   video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 5 } },
  dead_hang:        { id: 'ex-dead-hang',        name: 'Dead Hang',                    category: 'grip',           description: 'Passive dead hang from a pull-up bar. Log seconds.',                    video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 5 } },
  barbell_hold:     { id: 'ex-bb-hold',          name: 'Barbell Hold',                 category: 'grip',           description: 'Static barbell hold at lockout for grip endurance. Log seconds.',       video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 5 } },
  towel_pullups:    { id: 'ex-towel-pu',         name: 'Towel Pull-ups',               category: 'grip',           description: 'Pull-ups gripping a towel — brutal grip work.',                         video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },

  // ── Cardio ──────────────────────────────────────────────────────────────────
  running:          { id: 'ex-running',          name: 'Running',                      category: 'cardio',         description: 'Outdoor or treadmill running. Log time in seconds.',                    video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 30 } },
  run_walk:         { id: 'ex-run-walk',         name: 'Run/Walk Intervals',           category: 'cardio',         description: 'Alternating run and walk intervals. Log total time.',                   video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 30 } },
  skierg:           { id: 'ex-skierg',           name: 'SkiErg',                       category: 'cardio',         description: 'Concept2 SkiErg. Log time in seconds.',                                 video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 5  } },
  rowerg:           { id: 'ex-rowerg',           name: 'RowErg',                       category: 'cardio',         description: 'Concept2 RowErg. Log time in seconds.',                                 video_url: null, log: { type: 'time',        weight_step: 0,   time_step: 5  } },
  strides:          { id: 'ex-strides',          name: 'Strides',                      category: 'cardio',         description: '80m acceleration runs at ~80% effort — just check off.',                video_url: null, log: { type: 'check_only',  weight_step: 0,   time_step: 0 } },

  // ── Hyrox Specific ──────────────────────────────────────────────────────────
  sled_push:        { id: 'ex-sled-push',        name: 'Sled Push',                    category: 'hyrox_specific', description: 'Weighted sled push. Log total sled weight in kg.',                      video_url: null, log: { type: 'weight_reps', weight_step: 5,   time_step: 0 } },
  sled_pull:        { id: 'ex-sled-pull',        name: 'Sled Pull',                    category: 'hyrox_specific', description: 'Hand-over-hand rope sled pull. Log total sled weight in kg.',           video_url: null, log: { type: 'weight_reps', weight_step: 5,   time_step: 0 } },
  farmers_carry:    { id: 'ex-farmers-carry',    name: 'Farmers Carry',                category: 'hyrox_specific', description: 'Heavy loaded carry. Log weight per hand in kg (race: 2×24 kg).',        video_url: null, log: { type: 'weight_reps', weight_step: 2,   time_step: 0 } },
  wall_balls:       { id: 'ex-wall-balls',       name: 'Wall Balls',                   category: 'hyrox_specific', description: 'Medicine ball wall balls — standard 6 kg ball. Log reps.',               video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
  burpee_broad:     { id: 'ex-burpee-broad',     name: 'Burpee Broad Jumps',           category: 'hyrox_specific', description: 'Burpee into broad jump. Log reps (race: 80 m).',                        video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
  walking_lunges:   { id: 'ex-walking-lunges',   name: 'Walking Lunges',               category: 'hyrox_specific', description: 'Bodyweight or weighted walking lunges. Log reps.',                      video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
  sandbag_lunges:   { id: 'ex-sandbag-lunges',   name: 'Sandbag Lunges',               category: 'hyrox_specific', description: 'Lunges with sandbag — race weight 20 kg. Log reps.',                    video_url: null, log: { type: 'reps_only',   weight_step: 0,   time_step: 0 } },
}
