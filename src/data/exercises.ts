import type { Exercise } from '@/hooks/useProgram'

// ── All Exercises ──────────────────────────────────────────
export const exercises: Record<string, Exercise> = {
  // ── Strength: Lower ──
  back_squat:       { id: 'ex-back-squat',       name: 'Back Squat',              category: 'strength',       description: 'Barbell back squat — the king of lower body.', video_url: null },
  front_squat:      { id: 'ex-front-squat',      name: 'Front Squat',             category: 'strength',       description: 'Barbell front squat — quad dominant, core intensive.', video_url: null },
  pause_squat:      { id: 'ex-pause-squat',      name: 'Pause Squat',             category: 'strength',       description: 'Back squat with 2-sec pause at the bottom. Builds strength out of the hole.', video_url: null },
  tempo_squat:      { id: 'ex-tempo-squat',      name: 'Tempo Squat',             category: 'strength',       description: 'Back squat with controlled eccentric (4 sec down). Time under tension.', video_url: null },
  rdl:              { id: 'ex-rdl',              name: 'Romanian Deadlift (RDL)',  category: 'strength',       description: 'Barbell Romanian Deadlift — hamstrings + posterior chain.', video_url: null },
  deadlift:         { id: 'ex-deadlift',         name: 'Deadlift',                category: 'strength',       description: 'Conventional barbell deadlift.', video_url: null },
  deficit_deadlift: { id: 'ex-deficit-dl',       name: 'Deficit Deadlift',        category: 'strength',       description: 'Deadlift standing on a plate/platform for increased ROM.', video_url: null },
  pause_deadlift:   { id: 'ex-pause-dl',         name: 'Pause Deadlift',          category: 'strength',       description: 'Deadlift with 2-sec pause at knee height.', video_url: null },
  bulgarian:        { id: 'ex-bulgarian',        name: 'Bulgarian Split Squat',   category: 'strength',       description: 'Rear foot elevated split squat — single leg strength.', video_url: null },
  leg_press:        { id: 'ex-leg-press',        name: 'Leg Press',               category: 'strength',       description: 'Machine leg press — hypertrophy volume.', video_url: null },
  leg_curl:         { id: 'ex-leg-curl',         name: 'Leg Curl',                category: 'strength',       description: 'Machine hamstring curl.', video_url: null },
  leg_extension:    { id: 'ex-leg-ext',          name: 'Leg Extension',           category: 'strength',       description: 'Machine quad extension.', video_url: null },
  hip_thrust:       { id: 'ex-hip-thrust',       name: 'Hip Thrust',              category: 'strength',       description: 'Barbell hip thrust — glute dominant.', video_url: null },
  ghr:              { id: 'ex-ghr',              name: 'GHR / Nordic Curl',       category: 'strength',       description: 'Glute-ham raise or Nordic hamstring curl.', video_url: null },

  // ── Strength: Upper ──
  bench_press:      { id: 'ex-bench',            name: 'Bench Press',             category: 'strength',       description: 'Barbell flat bench press.', video_url: null },
  ohp:              { id: 'ex-ohp',              name: 'Overhead Press (OHP)',     category: 'strength',       description: 'Standing barbell overhead press.', video_url: null },
  barbell_row:      { id: 'ex-bb-row',           name: 'Barbell Row',             category: 'strength',       description: 'Bent-over barbell row.', video_url: null },
  pendlay_row:      { id: 'ex-pendlay',          name: 'Pendlay Row',             category: 'strength',       description: 'Strict barbell row from the floor each rep.', video_url: null },
  pullups:          { id: 'ex-pullups',          name: 'Pull-ups',                category: 'strength',       description: 'Bodyweight pull-ups.', video_url: null },
  weighted_pullups: { id: 'ex-weighted-pullups', name: 'Weighted Pull-ups',       category: 'strength',       description: 'Pull-ups with added weight (belt or DB).', video_url: null },
  db_incline_press: { id: 'ex-db-incline',       name: 'DB Incline Press',        category: 'strength',       description: 'Dumbbell incline bench press.', video_url: null },
  cable_row:        { id: 'ex-cable-row',        name: 'Cable Row',               category: 'strength',       description: 'Seated cable row.', video_url: null },
  chest_supported:  { id: 'ex-chest-row',        name: 'Chest Supported Row',     category: 'strength',       description: 'Chest supported dumbbell or machine row.', video_url: null },
  db_lateral_raise: { id: 'ex-lat-raise',        name: 'DB Lateral Raise',        category: 'strength',       description: 'Dumbbell lateral raise for shoulders.', video_url: null },
  cable_lat_raise:  { id: 'ex-cable-lat',        name: 'Cable Lateral Raise',     category: 'strength',       description: 'Cable lateral raise.', video_url: null },
  face_pulls:       { id: 'ex-face-pulls',       name: 'Face Pulls',              category: 'strength',       description: 'Cable face pulls — rear delt and rotator cuff health.', video_url: null },
  db_flye:          { id: 'ex-db-flye',          name: 'DB Flye',                 category: 'strength',       description: 'Dumbbell chest flye.', video_url: null },
  push_press:       { id: 'ex-push-press',       name: 'Push Press',              category: 'strength',       description: 'Barbell push press — leg drive into overhead.', video_url: null },

  // ── Arms ──
  barbell_curl:     { id: 'ex-bb-curl',          name: 'Barbell Curl',            category: 'arms',           description: 'Standing barbell bicep curl.', video_url: null },
  ez_curl:          { id: 'ex-ez-curl',          name: 'EZ Curl',                 category: 'arms',           description: 'EZ bar bicep curl.', video_url: null },
  hammer_curl:      { id: 'ex-hammer-curl',      name: 'Hammer Curl',             category: 'arms',           description: 'Dumbbell hammer curl — brachialis focus.', video_url: null },
  tricep_dips:      { id: 'ex-tricep-dips',      name: 'Tricep Dips',             category: 'arms',           description: 'Parallel bar or bench dips.', video_url: null },
  skull_crusher:    { id: 'ex-skull-crush',      name: 'Skull Crusher',           category: 'arms',           description: 'Lying EZ bar tricep extension.', video_url: null },
  overhead_tricep:  { id: 'ex-oh-tricep',        name: 'Overhead Tricep Extension', category: 'arms',         description: 'Cable or dumbbell overhead tricep extension.', video_url: null },

  // ── Core ──
  ab_wheel:         { id: 'ex-ab-wheel',         name: 'Ab Wheel Rollout',        category: 'core',           description: 'Ab wheel rollout from knees or standing.', video_url: null },
  pallof_press:     { id: 'ex-pallof',           name: 'Pallof Press',            category: 'core',           description: 'Cable Pallof press — anti-rotation core.', video_url: null },
  dead_bug:         { id: 'ex-dead-bug',         name: 'Dead Bug',                category: 'core',           description: 'Dead bug — contralateral limb extension for core stability.', video_url: null },
  dragon_flag:      { id: 'ex-dragon-flag',      name: 'Dragon Flag',             category: 'core',           description: 'Advanced core exercise — full body lever.', video_url: null },
  hanging_knee:     { id: 'ex-hang-knee',        name: 'Hanging Knee Raise',      category: 'core',           description: 'Hanging knee raise from a pull-up bar.', video_url: null },
  side_plank:       { id: 'ex-side-plank',       name: 'Side Plank',              category: 'core',           description: 'Side plank hold — lateral core stability.', video_url: null },
  copenhagen:       { id: 'ex-copenhagen',       name: 'Copenhagen Adductor',     category: 'core',           description: 'Copenhagen plank — adductor strength and injury prevention.', video_url: null },

  // ── Prehab ──
  foam_roll:        { id: 'ex-foam-roll',        name: 'Foam Roll IT-Band + Calves', category: 'prehab',      description: 'Foam roll IT-band and calf muscles, 2 min per side.', video_url: null },
  banded_clamshell: { id: 'ex-clamshell',        name: 'Banded Clamshells',       category: 'prehab',         description: 'Banded clamshells — gluteus medius activation.', video_url: null },
  eccentric_calf:   { id: 'ex-ecc-calf',         name: 'Eccentric Calf Raise',    category: 'prehab',         description: 'Slow eccentric calf raise from a step.', video_url: null },
  ankle_mobility:   { id: 'ex-ankle-mob',        name: 'Ankle Mobility',          category: 'prehab',         description: 'Knee-over-toe against wall, 2×20 per side.', video_url: null },
  sl_glute_bridge:  { id: 'ex-sl-bridge',        name: 'Single-Leg Glute Bridge', category: 'prehab',         description: 'Single-leg glute bridge for glute activation.', video_url: null },

  // ── Grip ──
  plate_pinch:      { id: 'ex-plate-pinch',      name: 'Plate Pinch',             category: 'grip',           description: 'Pinch grip plate hold for time.', video_url: null },
  towel_hang:       { id: 'ex-towel-hang',       name: 'Towel Hang',              category: 'grip',           description: 'Dead hang from a towel draped over bar.', video_url: null },
  fat_grip_hang:    { id: 'ex-fat-hang',         name: 'Fat Grip Hang',           category: 'grip',           description: 'Dead hang with fat gripz or thick bar.', video_url: null },
  dead_hang:        { id: 'ex-dead-hang',        name: 'Dead Hang',               category: 'grip',           description: 'Passive dead hang from a pull-up bar.', video_url: null },
  barbell_hold:     { id: 'ex-bb-hold',          name: 'Barbell Hold',            category: 'grip',           description: 'Static barbell hold at lockout for grip endurance.', video_url: null },
  towel_pullups:    { id: 'ex-towel-pu',         name: 'Towel Pull-ups',          category: 'grip',           description: 'Pull-ups gripping a towel — brutal grip work.', video_url: null },

  // ── Cardio ──
  running:          { id: 'ex-running',          name: 'Running',                 category: 'cardio',         description: 'Outdoor or treadmill running.', video_url: null },
  run_walk:         { id: 'ex-run-walk',         name: 'Run/Walk Intervals',      category: 'cardio',         description: 'Alternating run and walk intervals for building base.', video_url: null },
  skierg:           { id: 'ex-skierg',           name: 'SkiErg',                  category: 'cardio',         description: 'Concept2 SkiErg.', video_url: null },
  rowerg:           { id: 'ex-rowerg',           name: 'RowErg',                  category: 'cardio',         description: 'Concept2 RowErg.', video_url: null },
  strides:          { id: 'ex-strides',          name: 'Strides',                 category: 'cardio',         description: '80m acceleration runs at ~80% effort.', video_url: null },

  // ── Hyrox Specific ──
  sled_push:        { id: 'ex-sled-push',        name: 'Sled Push',               category: 'hyrox_specific', description: 'Weighted sled push — low, short, explosive.', video_url: null },
  sled_pull:        { id: 'ex-sled-pull',        name: 'Sled Pull',               category: 'hyrox_specific', description: 'Hand-over-hand rope sled pull.', video_url: null },
  farmers_carry:    { id: 'ex-farmers-carry',    name: 'Farmers Carry',           category: 'hyrox_specific', description: 'Heavy loaded carry — race weight 2×24kg.', video_url: null },
  wall_balls:       { id: 'ex-wall-balls',       name: 'Wall Balls',              category: 'hyrox_specific', description: 'Medicine ball wall balls — 6kg race weight.', video_url: null },
  burpee_broad:     { id: 'ex-burpee-broad',     name: 'Burpee Broad Jumps',      category: 'hyrox_specific', description: 'Burpee into a broad jump — 80m race distance.', video_url: null },
  walking_lunges:   { id: 'ex-walking-lunges',   name: 'Walking Lunges',          category: 'hyrox_specific', description: 'Bodyweight or weighted walking lunges.', video_url: null },
  sandbag_lunges:   { id: 'ex-sandbag-lunges',   name: 'Sandbag Lunges',          category: 'hyrox_specific', description: 'Lunges carrying a sandbag — 20kg race weight.', video_url: null },
}
