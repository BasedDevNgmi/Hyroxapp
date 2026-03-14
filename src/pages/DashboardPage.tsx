import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Play, Bookmark } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Programs')

  return (
    <div className="min-h-screen bg-[#1a1914] flex flex-col font-sans">
      
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#1a1914]/90 backdrop-blur-md border-b border-[#2d2a21] px-5 py-4 flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold tracking-widest text-white">LUXE FITNESS</h1>
        <button className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* ── TABS (Programs | Classes | Recover) ── */}
      <div className="px-5 pt-4">
         <div className="flex gap-6 border-b border-[#2d2a21]">
            {['Programs', 'Classes', 'Recover'].map((tab) => (
               <button
                  key={tab}
                  className={`pb-3 text-sm font-semibold transition-colors relative ${
                     activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
               >
                  {tab}
                  {activeTab === tab && (
                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  )}
               </button>
            ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
         
         {/* ── HERO SECTION ("New This Week") ── */}
         <section className="p-5">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">New This Week</h2>
            
            <div 
               onClick={() => navigate('/program')}
               className="relative w-full h-80 rounded-3xl overflow-hidden cursor-pointer group"
            >
               {/* Background Image */}
               <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: 'url("/images/dashboard_hero.png")' }}
               />
               {/* Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#1a1914] via-[#1a1914]/40 to-transparent" />
               
               {/* Content */}
               <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col">
                  <span className="self-start px-2 py-1 mb-3 rounded bg-primary/20 border border-primary/30 text-[10px] font-bold text-primary uppercase tracking-wider backdrop-blur-md">
                     Exclusive
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-white leading-tight mb-2">Hyrox Intro<br/>Masterclass</h3>
                  <p className="text-sm text-gray-300 font-light mb-5">Master the foundational movements required to dominate your first race.</p>
                  
                  <Button variant="primary" className="w-full gap-2 font-bold tracking-widest shadow-[0_4px_20px_0_rgba(250,204,21,0.3)]">
                     <Play className="w-4 h-4 fill-current" />
                     START PROGRAM
                  </Button>
               </div>
            </div>
         </section>

         {/* ── HORIZONTAL SCROLL LIST ("Recommended for You") ── */}
         <section className="pt-2 pb-6">
            <div className="px-5 mb-4 flex items-center justify-between">
               <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Recommended for You</h2>
               <span className="text-[10px] font-bold text-primary uppercase tracking-wider cursor-pointer">View All</span>
            </div>

            <div className="flex overflow-x-auto gap-4 px-5 pb-4 snap-x snap-mandatory scrollbar-hide">
               {/* Item 1 */}
               <div className="w-[280px] shrink-0 snap-start bg-[#24221b] border border-[#3f3b2f] rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors">
                  <div 
                     className="w-full h-36 bg-cover bg-center relative"
                     style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600&h=400")' }}
                  >
                     <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">45 MIN</div>
                  </div>
                  <div className="p-4">
                     <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-white leading-tight pr-4">Power Rowing<br/>Intervals</h4>
                        <button className="text-gray-500 hover:text-primary transition-colors"><Bookmark className="w-4 h-4" /></button>
                     </div>
                     <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Endurance • Advanced</p>
                  </div>
               </div>

               {/* Item 2 */}
               <div className="w-[280px] shrink-0 snap-start bg-[#24221b] border border-[#3f3b2f] rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors">
                  <div 
                     className="w-full h-36 bg-cover bg-center relative"
                     style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600&h=400")' }}
                  >
                     <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">30 MIN</div>
                  </div>
                  <div className="p-4">
                     <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-white leading-tight pr-4">Kettlebell Target<br/>Practice</h4>
                        <button className="text-gray-500 hover:text-primary transition-colors"><Bookmark className="w-4 h-4" /></button>
                     </div>
                     <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Strength • Beginner</p>
                  </div>
               </div>
               
               {/* Item 3 */}
               <div className="w-[280px] shrink-0 snap-start bg-[#24221b] border border-[#3f3b2f] rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors">
                  <div 
                     className="w-full h-36 bg-cover bg-center relative"
                     style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&q=80&w=600&h=400")' }}
                  >
                     <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">60 MIN</div>
                  </div>
                  <div className="p-4">
                     <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-white leading-tight pr-4">Full Body Flow<br/>Recovery</h4>
                        <button className="text-gray-500 hover:text-primary transition-colors"><Bookmark className="w-4 h-4" /></button>
                     </div>
                     <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Mobility • All Levels</p>
                  </div>
               </div>
            </div>
         </section>

      </div>
      
      {/* ── FLOATING BOTTOM NAV ── */}
      <BottomNav />
    </div>
  )
}
