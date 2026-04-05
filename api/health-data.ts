import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET: fetch latest health metrics
  if (req.method === 'GET') {
    const supabase = getSupabase()
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })

    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .order('date', { ascending: false })
      .limit(7)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // POST: receive health data from Health Auto Export
  if (req.method === 'POST') {
    const secret = process.env.HEALTH_EXPORT_API_KEY
    if (secret && req.headers.authorization !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const supabase = getSupabase()
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })

    const body = req.body
    if (!body) return res.status(400).json({ error: 'Missing body' })

    // Support both single metric and array
    const metrics = Array.isArray(body) ? body : [body]

    for (const m of metrics) {
      const row = {
        date: m.date || new Date().toISOString().slice(0, 10),
        sleep_hours: m.sleep_hours ?? null,
        hrv_sdnn: m.hrv_sdnn ?? null,
        resting_hr: m.resting_hr ?? null,
        active_calories: m.active_calories ?? null,
      }

      const { error } = await supabase
        .from('health_metrics')
        .upsert(row, { onConflict: 'date' })

      if (error) return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ ok: true, count: metrics.length })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}
