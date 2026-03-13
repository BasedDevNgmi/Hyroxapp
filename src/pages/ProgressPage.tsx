import { useProgress, type PRData } from '@/hooks/useProgress'
import { Loader2, TrendingUp, TrendingDown, Timer, Weight } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { format } from 'date-fns'

export default function ProgressPage() {
  const { prData, loading } = useProgress()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const startingValues: Record<string, { value: number; unit: string }> = {
    'Back Squat': { value: 105, unit: 'kg' },
    'Running (1km)': { value: 300, unit: 'seconds' },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your PRs and improvements</p>
      </div>

      {prData.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 border border-border text-center space-y-3">
          <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            No data yet. Complete some workouts to see your progress!
          </p>
        </div>
      ) : (
        prData.map(pr => (
          <PRChart key={pr.exercise_name} data={pr} startingValue={startingValues[pr.exercise_name]} />
        ))
      )}

      {/* Starting benchmarks info */}
      <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <h3 className="text-sm font-semibold">Starting Benchmarks</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Back Squat</p>
              <p className="text-sm font-medium">105 kg</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">1km Run</p>
              <p className="text-sm font-medium">5:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PRChart({
  data,
  startingValue,
}: {
  data: PRData
  startingValue?: { value: number; unit: string }
}) {
  const isTimeBased = data.unit === 'seconds'

  const chartData = data.history.map(p => ({
    date: format(new Date(p.date), 'MMM d'),
    value: p.value,
    label: isTimeBased
      ? `${Math.floor(p.value / 60)}:${String(Math.floor(p.value % 60)).padStart(2, '0')}`
      : `${p.value}kg`,
  }))

  const formatValue = (v: number) =>
    isTimeBased
      ? `${Math.floor(v / 60)}:${String(Math.floor(v % 60)).padStart(2, '0')}`
      : `${v}kg`

  const improvement = startingValue
    ? isTimeBased
      ? startingValue.value - data.current_value
      : data.current_value - startingValue.value
    : 0

  const improvementPct = startingValue
    ? Math.abs((improvement / startingValue.value) * 100).toFixed(1)
    : '0'

  const isImproved = improvement > 0

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{data.exercise_name}</h3>
          {startingValue && (
            <span className={`flex items-center gap-1 text-xs font-medium ${isImproved ? 'text-success' : 'text-destructive'}`}>
              {isImproved ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {improvementPct}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-primary">{formatValue(data.current_value)}</p>
        <p className="text-xs text-muted-foreground">Personal Best</p>
      </div>

      {chartData.length > 1 && (
        <div className="h-40 px-2 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#a1a1a1' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#a1a1a1' }}
                axisLine={false}
                tickLine={false}
                width={40}
                reversed={isTimeBased}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141414',
                  border: '1px solid #262626',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#a1a1a1' }}
                formatter={(value) => [formatValue(Number(value)), data.exercise_name]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#d4ff00"
                strokeWidth={2}
                dot={{ fill: '#d4ff00', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
