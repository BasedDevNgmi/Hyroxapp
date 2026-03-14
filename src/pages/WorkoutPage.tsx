import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Maximize2, X, Plus, Minus, Info, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Card } from '@/components/ui/Card'

// Mock Data for the phase
const SESSION_DATA = {
  title: 'Hyrox Strength Development',
  phase: 'Phase 2: Build',
  week: 3,
  day: 2,
  duration: '60 min',
  focus: 'Lower Body Power',
}

const STATIONS = [
  { id: 1, name: 'Warmup', type: 'info', description: '5min Light Jog + Dynamic Stretching' },
  { id: 2, name: 'Sled Push', type: 'hybrid', sets: 4, target: '125kg x 15m' },
  { id: 3, name: 'Wall Balls', type: 'weight', sets: 4, target: '20 reps @ 6kg' },
  { id: 4, name: 'Rowing', type: 'cardio', sets: 1, target: '1000m @ 2:00/500m' },
]

export default function WorkoutPage() {
  const navigate = useNavigate()
  
  // Timer State
  const [timerActive, setTimerActive] = useState(false)
  const [time, setTime] = useState(0) // in seconds
  
  // Progress State
  const [activeStationIndex, setActiveStationIndex] = useState(1) // Start at index 1 (Sled Push)
  
  // Example Form State for current station
  const [kgValue, setKgValue] = useState(125)
  const [mValue, setMValue] = useState(15)

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (timerActive) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive])

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentStation = STATIONS[activeStationIndex]
  const progressPercent = Math.round((activeStationIndex / STATIONS.length) * 100)

  return (
    <div className="min-h-screen bg-[#1a1914] flex flex-col font-sans overflow-x-hidden">
      
      {/* ── HEADER (Compact & Fixed) ── */}
      <div className="sticky top-0 z-40 bg-[#1a1914]/90 backdrop-blur-md border-b border-[#2d2a21] px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Week {SESSION_DATA.week} • Day {SESSION_DATA.day}</span>
           <span className="text-sm font-semibold">{SESSION_DATA.title}</span>
        </div>
        <button className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 p-5 pb-32 flex flex-col">
        
        {/* ── TIMER SECTION (Image 0 Top) ── */}
        <div className="flex flex-col items-center justify-center py-6 mb-4">
          <div className="relative group cursor-pointer mb-2">
            {/* Glowing ring */}
            <div className={`absolute -inset-4 bg-primary/20 rounded-full blur-xl transition-opacity duration-1000 ${timerActive ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Main Timer text */}
            <div className="relative z-10 flex items-baseline justify-center font-heading tabular-nums text-white">
              <span className="text-6xl font-bold tracking-tight">{formatTime(time)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4 mt-4">
             <Button 
                variant={timerActive ? 'outline' : 'primary'} 
                size="sm"
                className={`w-24 rounded-full font-bold uppercase tracking-wider text-xs ${timerActive ? 'border-[#3f3b2f] text-gray-300' : ''}`}
                onClick={() => setTimerActive(!timerActive)}
             >
                {timerActive ? 'PAUSE' : 'START'}
             </Button>
             <button onClick={() => { setTime(0); setTimerActive(false) }} className="w-10 h-10 rounded-full bg-[#24221b] border border-[#3f3b2f] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                <X className="w-4 h-4" />
             </button>
             <button className="w-10 h-10 rounded-full bg-[#24221b] border border-[#3f3b2f] flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                <Maximize2 className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="mb-8">
           <div className="flex justify-between items-end mb-2">
             <span className="text-xs text-gray-400 font-medium">Session Progress</span>
             <span className="text-xs font-bold text-primary">{progressPercent}%</span>
           </div>
           <ProgressBar progress={progressPercent} height="sm" trackColor="bg-[#24221b]" activeColor="bg-primary" />
        </div>

        {/* ── ACTIVE STATION CARD (Floating form from Image 0) ── */}
        <div className="flex-1 flex flex-col justify-center">
            <Card className="p-6 relative overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.05)] border-primary/20">
               {/* Background accent */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
               
               <div className="flex items-center justify-between mb-6 relative z-10">
                 <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1 block">Station {activeStationIndex + 1}/{STATIONS.length}</span>
                    <h2 className="text-2xl font-bold font-heading">{currentStation.name}</h2>
                 </div>
                 <button className="w-8 h-8 rounded-full bg-[#1a1914] border border-[#3f3b2f] flex items-center justify-center text-gray-400">
                    <Info className="w-4 h-4" />
                 </button>
               </div>

               <p className="text-sm text-gray-400 font-light mb-6 border-l-2 border-[#3f3b2f] pl-3 py-1">
                 Target: {currentStation.target}
               </p>

               {/* Input Area */}
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                     <span className="text-sm font-medium w-12 text-gray-300">Set 1</span>
                     
                     {/* Input Group 1 (e.g. KG) */}
                     <div className="flex-1 bg-[#1a1914] rounded-xl flex items-center border border-[#3f3b2f] focus-within:border-primary/50 transition-colors">
                        <button 
                          onClick={() => setKgValue(Math.max(0, kgValue - 5))}
                          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-l-xl transition-colors"
                        >
                           <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex-1 text-center font-heading font-bold text-lg flex items-baseline justify-center gap-1">
                           {kgValue} <span className="text-[10px] text-gray-500 font-normal tracking-wide">KG</span>
                        </div>
                        <button 
                          onClick={() => setKgValue(kgValue + 5)}
                          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-r-xl transition-colors"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <span className="text-sm font-medium w-12 text-gray-300 invisible">Set 1</span> {/* Spacer */}
                     
                     {/* Input Group 2 (e.g. M) */}
                     <div className="flex-1 bg-[#1a1914] rounded-xl flex items-center border border-[#3f3b2f] focus-within:border-primary/50 transition-colors">
                        <button 
                          onClick={() => setMValue(Math.max(0, mValue - 1))}
                          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-l-xl transition-colors"
                        >
                           <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex-1 text-center font-heading font-bold text-lg flex items-baseline justify-center gap-1">
                           {mValue} <span className="text-[10px] text-gray-500 font-normal tracking-wide">M</span>
                        </div>
                        <button 
                          onClick={() => setMValue(mValue + 1)}
                          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-r-xl transition-colors"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               </div>

               <div className="mt-8 flex gap-3">
                  <Button variant="outline" className="flex-1 font-bold">
                     ADD NOTE
                  </Button>
                  <Button 
                     className="flex-[2] font-bold tracking-widest shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                     onClick={() => {
                        if (activeStationIndex < STATIONS.length - 1) {
                           setActiveStationIndex(prev => prev + 1)
                        } else {
                           // Finish Workout
                           navigate('/progress') // Or wherever the summary is
                        }
                     }}
                  >
                     {activeStationIndex < STATIONS.length - 1 ? 'NEXT STATION' : 'FINISH WORKOUT'}
                  </Button>
               </div>
            </Card>

            {/* Upcoming stations preview */}
            {activeStationIndex < STATIONS.length - 1 && (
               <div className="mt-6 flex items-center gap-3 px-2 opacity-50">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Next:</span>
                 <span className="text-sm font-medium text-gray-300">{STATIONS[activeStationIndex + 1].name}</span>
               </div>
            )}
        </div>
      </div>
    </div>
  )
}
