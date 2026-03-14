
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Share2, TrendingUp, Activity, Timer } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function ProgressPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#1a1914] flex flex-col font-sans pb-24">
      {/* ── HEADER ── */}
      <div className="sticky top-0 z-40 bg-[#1a1914]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-semibold tracking-wide">Session Summary</span>
        <button className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
           <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="px-5 pt-4 space-y-6">
         {/* Title Area */}
         <div className="text-center space-y-2">
            <h1 className="text-3xl font-heading font-bold text-white">Hyrox Strength Development</h1>
            <p className="text-sm text-primary font-bold tracking-widest uppercase">Phase 2: Build</p>
         </div>

         {/* ── STATS GRID (Image 2 Top) ── */}
         <div className="grid grid-cols-2 gap-3">
            <Card className="p-5 flex flex-col items-center justify-center text-center bg-[#24221b] border-[#3f3b2f]">
               <Timer className="w-6 h-6 text-primary mb-3" />
               <span className="text-3xl font-heading font-bold text-white mb-1">62:15</span>
               <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Time</span>
            </Card>

            <Card className="p-5 flex flex-col items-center justify-center text-center bg-[#24221b] border-[#3f3b2f]">
               <Activity className="w-6 h-6 text-[#facc15] mb-3" />
               <span className="text-3xl font-heading font-bold text-white mb-1">84%</span>
               <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Avg Intensity</span>
            </Card>
         </div>

         <Card className="p-5 bg-primary/10 border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
               </div>
               <div>
                  <h3 className="text-sm font-bold text-white">Personal Best</h3>
                  <p className="text-xs text-primary">Sled Push: 125kg x 15m</p>
               </div>
            </div>
         </Card>

         {/* ── INTENSITY GRAPH (Image 2 Bottom) ── */}
         <div className="mt-8">
            <h2 className="text-lg font-heading font-bold text-white mb-4">Intensity Profile</h2>
            <Card className="p-5 bg-[#24221b] border-[#3f3b2f] h-48 relative flex items-end">
               {/* Mock Graph Bars */}
               <div className="absolute inset-y-5 inset-x-5 flex items-end justify-between gap-1">
                  {[20, 30, 40, 60, 85, 90, 75, 60, 80, 95, 100, 85, 70, 50, 40, 20].map((h, i) => (
                     <div 
                        key={i} 
                        className={`w-full rounded-t-sm transition-all duration-1000 ${h >= 85 ? 'bg-primary shadow-[0_0_10px_rgba(250,204,21,0.5)]' : h >= 60 ? 'bg-[#c49b00]' : 'bg-[#5c4a00]'}`}
                        style={{ height: `${h}%` }}
                     />
                  ))}
               </div>
               
               {/* Zones overlay */}
               <div className="absolute inset-x-5 top-5 bottom-5 pointer-events-none flex flex-col justify-between">
                  {/* High */}
                  <div className="w-full border-t border-dashed border-primary/20 relative">
                     <span className="absolute -top-3 -right-2 text-[8px] text-primary font-bold">ZONE 5</span>
                  </div>
                  {/* Med */}
                  <div className="w-full border-t border-dashed border-gray-600/30"></div>
                  {/* Low */}
                  <div className="w-full border-t border-dashed border-gray-600/30 relative"></div>
               </div>
            </Card>
         </div>

         <Button size="lg" className="w-full mt-6 gap-2 font-bold tracking-widest shadow-[0_0_20px_rgba(250,204,21,0.15)]">
            <Share2 className="w-4 h-4" />
            SHARE SUMMARY
         </Button>

      </div>
    </div>
  )
}
