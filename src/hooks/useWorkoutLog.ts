import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
export interface WorkoutLog {
  id: string
  user_id: string
  workout_id: string
  completed_at: string
  knee_pain_level: number | null
  overall_rpe: number | null
  notes: string | null
  duration_minutes: number | null
}

export interface ExerciseLogDraft {
  workout_exercise_id: string
  set_number: number
  weight_kg: number | null
  reps_completed: number | null
  time_seconds: number | null
  completed: boolean
  notes: string
}

export interface WorkoutLogDraft {
  workout_id: string
  knee_pain_level: number
  overall_rpe: number
  notes: string
  exercise_logs: ExerciseLogDraft[]
}

const DRAFT_KEY = (workoutId: string) => `hyrox_draft_${workoutId}`

export function useWorkoutLog(workoutId: string) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [existingLog, setExistingLog] = useState<WorkoutLog | null>(null)

  useEffect(() => {
    if (!user || !workoutId) return

    const fetchExisting = async () => {
      const { data } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('workout_id', workoutId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      setExistingLog(data as WorkoutLog | null)
    }
    fetchExisting()
  }, [user, workoutId])

  const saveDraft = (draft: WorkoutLogDraft) => {
    localStorage.setItem(DRAFT_KEY(workoutId), JSON.stringify(draft))
  }

  const loadDraft = (): WorkoutLogDraft | null => {
    const stored = localStorage.getItem(DRAFT_KEY(workoutId))
    return stored ? JSON.parse(stored) : null
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY(workoutId))
  }

  const saveWorkoutLog = async (draft: WorkoutLogDraft, startTime: Date) => {
    if (!user) return { error: new Error('Not authenticated') }

    setSaving(true)
    const durationMinutes = Math.round((Date.now() - startTime.getTime()) / 60000)

    const { data: workoutLogData, error: logError } = await supabase
      .from('workout_logs')
      .insert({
        user_id: user.id,
        workout_id: draft.workout_id,
        knee_pain_level: draft.knee_pain_level,
        overall_rpe: draft.overall_rpe,
        notes: draft.notes || null,
        duration_minutes: durationMinutes,
      })
      .select()
      .single()

    const workoutLog = workoutLogData as WorkoutLog | null

    if (logError || !workoutLog) {
      setSaving(false)
      return { error: new Error(logError?.message || 'Failed to save workout') }
    }

    const exerciseLogs = draft.exercise_logs.map(el => ({
      workout_log_id: workoutLog.id,
      workout_exercise_id: el.workout_exercise_id,
      set_number: el.set_number,
      weight_kg: el.weight_kg,
      reps_completed: el.reps_completed,
      time_seconds: el.time_seconds,
      completed: el.completed,
      notes: el.notes || null,
    }))

    if (exerciseLogs.length > 0) {
      const { error: elError } = await supabase
        .from('exercise_logs')
        .insert(exerciseLogs)

      if (elError) {
        setSaving(false)
        return { error: new Error(elError.message) }
      }
    }

    clearDraft()
    setSaving(false)
    return { error: null, workoutLog }
  }

  return { saveWorkoutLog, saveDraft, loadDraft, clearDraft, saving, existingLog }
}

export function useWorkoutLogs() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      const { data } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      setLogs(data || [])
      setLoading(false)
    }
    fetch()
  }, [user])

  return { logs, loading }
}
