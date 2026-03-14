import { useState } from 'react'

import { Trophy, Zap, CheckCircle2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function ProgramPage() {
  const [journeyPhase, setJourneyPhase] = useState<'selection' | 'timeline'>('selection')
  const [selectedJourney, setSelectedJourney] = useState<string>('foundations')

  if (journeyPhase === 'selection') {
    return (
      <div className="fixed inset-0 bg-[#1a1914] z-50 flex flex-col overflow-y-auto pb-24">
        {/* Hero Image */}
        <div className="relative w-full h-[40vh] shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-bottom"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800&h=800")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1914] to-transparent/20" />
          <div className="absolute top-12 left-0 right-0 text-center">
            <span className="text-white text-sm font-heading tracking-[0.3em]">L U M I N A</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 flex-1 -mt-8 relative z-10 flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold mb-3">Select Your Journey</h1>
            <p className="text-sm font-light text-gray-400 max-w-[280px] mx-auto leading-relaxed">
              Begin your path to wellness with a program tailored to your intentions.
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {/* Option 1 */}
            <div 
              onClick={() => setSelectedJourney('foundations')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedJourney === 'foundations' 
                  ? 'bg-[#24221b] border-primary shadow-[0_0_15px_rgba(250,204,21,0.1)]' 
                  : 'bg-[#24221b] border-[#3f3b2f] hover:border-primary/50'
              }`}
            >
              <div>
                <h3 className="font-bold text-lg mb-1">Foundations</h3>
                <p className="text-xs text-gray-400">Perfect for those starting their practice</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedJourney === 'foundations' ? 'border-primary' : 'border-gray-500'}`}>
                {selectedJourney === 'foundations' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
            </div>

            {/* Option 2 */}
            <div 
              onClick={() => setSelectedJourney('strength')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedJourney === 'strength' 
                  ? 'bg-[#24221b] border-primary shadow-[0_0_15px_rgba(250,204,21,0.1)]' 
                  : 'bg-[#24221b] border-[#3f3b2f] hover:border-primary/50'
              }`}
            >
              <div>
                <h3 className="font-bold text-lg mb-1">Strength & Tone</h3>
                <p className="text-xs text-gray-400">Focus on definition and core stability</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedJourney === 'strength' ? 'border-primary' : 'border-gray-500'}`}>
                {selectedJourney === 'strength' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
            </div>

            {/* Option 3 */}
            <div 
              onClick={() => setSelectedJourney('mindful')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedJourney === 'mindful' 
                  ? 'bg-[#24221b] border-primary shadow-[0_0_15px_rgba(250,204,21,0.1)]' 
                  : 'bg-[#24221b] border-[#3f3b2f] hover:border-primary/50'
              }`}
            >
              <div>
                <h3 className="font-bold text-lg mb-1">Mindful Movement</h3>
                <p className="text-xs text-gray-400">Slow flow for mental clarity and flexibility</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedJourney === 'mindful' ? 'border-primary' : 'border-gray-500'}`}>
                {selectedJourney === 'mindful' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-8 font-bold tracking-widest gap-2" 
            size="lg"
            onClick={() => setJourneyPhase('timeline')}
          >
            CONTINUE TO JOURNEY →
          </Button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
          </div>
        </div>
      </div>
    )
  }

  // --- TIMELINE VIEW (Image 3) ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">Hyrox Elite Program</h1>
        <div className="w-10 h-10 rounded-full bg-[#2d2a21] border border-[#3f3b2f] flex items-center justify-center text-primary">
          <Trophy className="w-5 h-5" />
        </div>
      </div>

      {/* Global Status Card */}
      <Card className="p-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa] mb-2">Global Status</div>
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-heading">34%</span>
            <span className="text-sm text-gray-400">Overall</span>
          </div>
          <div className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold font-heading">
            1/3 Phases
          </div>
        </div>
        
        <ProgressBar progress={34} height="md" trackColor="bg-[#2d2a21]" className="mb-4" />
        
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          You've mastered the fundamentals. Next milestone: Power Phase.
        </p>
      </Card>

      <div className="flex items-center justify-between mt-8 mb-6">
        <h2 className="text-xl font-heading font-bold">Training Journey</h2>
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase cursor-pointer">View Roadmap</span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-10">
        {/* Timeline Line */}
        <div className="absolute left-[35px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-[#2d2a21]" />

        {/* Phase 1 (Completed) */}
        <div className="relative">
          <div className="absolute -left-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[#1a1914] z-10 shadow-[0_0_15px_rgba(250,204,21,0.4)]">
            <CheckCircle2 className="w-5 h-5 fill-current" />
          </div>
          <div className="pl-4">
            <h3 className="text-lg font-bold mb-1">Phase 1: Base Engine</h3>
            <p className="text-sm text-gray-400 font-light mb-3">Foundational aerobic capacity & technique</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-[#2d2a21] rounded text-[10px] uppercase font-bold text-gray-400 tracking-wider">8 Weeks</span>
              <span className="px-2 py-1 bg-[#2d2a21] border border-primary/30 rounded text-[10px] uppercase font-bold text-primary tracking-wider">Completed</span>
            </div>
            
            <div className="mt-4 rounded-xl overflow-hidden h-32 relative opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100 cursor-pointer">
               <img src="/images/phase_1.png" alt="Foundation" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Phase 2 (Active/Next) */}
        <div className="relative">
          <div className="absolute -left-10 w-8 h-8 rounded-full bg-[#1a1914] border-2 border-primary flex items-center justify-center text-primary z-10 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div className="pl-4">
            <h3 className="text-lg font-bold mb-1">Phase 2: Strength & Power</h3>
            <p className="text-sm text-gray-400 font-light mb-3">Functional strength and explosive movements</p>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-[#2d2a21] rounded text-[10px] uppercase font-bold text-gray-400 tracking-wider">6 Weeks</span>
              <span className="px-2 py-1 bg-primary text-[#1a1914] rounded text-[10px] uppercase font-bold tracking-wider">Up Next</span>
            </div>
            
            <div className="mb-4 rounded-xl overflow-hidden h-36 relative shadow-[0_0_15px_rgba(250,204,21,0.2)]">
               <img src="/images/phase_2.png" alt="Strength & Power" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#1a1914] to-transparent/20" />
            </div>

            <Button className="w-full font-bold tracking-widest shadow-[0_0_20px_rgba(250,204,21,0.15)]">
              START PHASE 2
            </Button>
          </div>
        </div>

        {/* Phase 3 (Locked) */}
        <div className="relative opacity-40">
          <div className="absolute -left-10 w-8 h-8 rounded-full bg-[#2d2a21] flex items-center justify-center text-[#a1a1aa] z-10">
            <Lock className="w-4 h-4" />
          </div>
          <div className="pl-4">
            <h3 className="text-lg font-bold mb-1">Phase 3: Peak Performance</h3>
            <p className="text-sm text-gray-400 font-light mb-3">Competition prep and max intensity tapering</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-[#2d2a21] rounded text-[10px] uppercase font-bold text-gray-400 tracking-wider">4 Weeks</span>
              <span className="px-2 py-1 bg-[#2d2a21] rounded text-[10px] uppercase font-bold text-gray-500 tracking-wider">Locked</span>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden h-24 relative opacity-30 grayscale">
               <img src="/images/phase_3.png" alt="Peak Performance" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
