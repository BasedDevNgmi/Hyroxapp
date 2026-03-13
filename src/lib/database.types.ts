export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          program_start_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          program_start_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          program_start_date?: string | null
          updated_at?: string
        }
      }
      programs: {
        Row: {
          id: string
          name: string
          description: string | null
          week_start: number
          week_end: number
          order_index: number
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          week_start: number
          week_end: number
          order_index: number
        }
        Update: {
          name?: string
          description?: string | null
          week_start?: number
          week_end?: number
          order_index?: number
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          video_url: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          video_url?: string | null
        }
        Update: {
          name?: string
          category?: string
          description?: string | null
          video_url?: string | null
        }
      }
      workouts: {
        Row: {
          id: string
          program_id: string
          week_number: number
          day_number: number
          name: string
          focus: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          program_id: string
          week_number: number
          day_number: number
          name: string
          focus?: string | null
          notes?: string | null
        }
        Update: {
          program_id?: string
          week_number?: number
          day_number?: number
          name?: string
          focus?: string | null
          notes?: string | null
        }
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          order_index: number
          sets: number
          reps: string | null
          tempo: string | null
          rest_seconds: number | null
          duration_seconds: number | null
          target_weight_kg: number | null
          distance_meters: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          order_index: number
          sets: number
          reps?: string | null
          tempo?: string | null
          rest_seconds?: number | null
          duration_seconds?: number | null
          target_weight_kg?: number | null
          distance_meters?: number | null
          notes?: string | null
        }
        Update: {
          workout_id?: string
          exercise_id?: string
          order_index?: number
          sets?: number
          reps?: string | null
          tempo?: string | null
          rest_seconds?: number | null
          duration_seconds?: number | null
          target_weight_kg?: number | null
          distance_meters?: number | null
          notes?: string | null
        }
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          workout_id: string
          completed_at: string
          knee_pain_level: number | null
          overall_rpe: number | null
          notes: string | null
          duration_minutes: number | null
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          completed_at?: string
          knee_pain_level?: number | null
          overall_rpe?: number | null
          notes?: string | null
          duration_minutes?: number | null
        }
        Update: {
          user_id?: string
          workout_id?: string
          completed_at?: string
          knee_pain_level?: number | null
          overall_rpe?: number | null
          notes?: string | null
          duration_minutes?: number | null
        }
      }
      exercise_logs: {
        Row: {
          id: string
          workout_log_id: string
          workout_exercise_id: string
          set_number: number
          weight_kg: number | null
          reps_completed: number | null
          time_seconds: number | null
          completed: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          workout_log_id: string
          workout_exercise_id: string
          set_number: number
          weight_kg?: number | null
          reps_completed?: number | null
          time_seconds?: number | null
          completed?: boolean
          notes?: string | null
        }
        Update: {
          workout_log_id?: string
          workout_exercise_id?: string
          set_number?: number
          weight_kg?: number | null
          reps_completed?: number | null
          time_seconds?: number | null
          completed?: boolean
          notes?: string | null
        }
      }
      personal_records: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          value: number
          unit: string
          achieved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          value: number
          unit: string
          achieved_at?: string
        }
        Update: {
          user_id?: string
          exercise_id?: string
          value?: number
          unit?: string
          achieved_at?: string
        }
      }
    }
  }
}
