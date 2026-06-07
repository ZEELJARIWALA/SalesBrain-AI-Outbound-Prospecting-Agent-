import React from 'react';
import { Brain, Cpu, Database, TrendingUp, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onStart: (tab: string) => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden pt-20 pb-32">
      {/* Hero Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] hero-gradient pointer-events-none opacity-50" />

      <div className="container px-6 mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 border border-primary/20 backdrop-blur-sm animate-pulse">
            <Sparkles size={16} />
            <span>Memory-Powered Sales Intelligence</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Outbound with <span className="gradient-text">Context.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
            SalesBrain AI learns from every interaction using Hindsight vector memory. 
            Stop second-guessing your hooks and start using what actually works.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <button 
              onClick={() => onStart('demo')}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/25 hover:scale-105 transition-all flex items-center gap-2 group"
            >
              Run Demo Scenario
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onStart('dashboard')}
              className="px-8 py-4 bg-card text-foreground border border-border rounded-2xl font-bold text-lg hover:bg-secondary transition-all"
            >
              View Analytics
            </button>
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
        >
          {[
            { 
              icon: Database, 
              title: "Hindsight Memory", 
              desc: "Stores every campaign, response, and objection in a vector database for semantic retrieval." 
            },
            { 
              icon: Cpu, 
              title: "AI Learning Engine", 
              desc: "Identifies winning messaging patterns and optimizes outreach hooks based on historical data." 
            },
            { 
              icon: TrendingUp, 
              title: "Adaptive Coaching", 
              desc: "Evaluates your message before you launch, predicting response rates based on past performance." 
            }
          ].map((f, i) => (
            <motion.div key={i} variants={item} className="p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all group">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed italic">"{f.desc}"</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture Visual */}
        <div className="rounded-[3rem] bg-slate-900 text-white p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 italic">The Memory Flow</h2>
              <div className="space-y-6">
                {[
                  "Campaign history stored in Hindsight",
                  "Prospect interactions (Objections/Replies) logged",
                  "AI identifies success hooks vs. aggressive failures",
                  "Real-time coaching recommendations generated"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-zinc-300 text-lg">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
               <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-bounce shadow-2xl shadow-blue-600/50">
                    <Brain size={48} />
                  </div>
                  <div className="text-3xl font-black tracking-widest uppercase">The Brain</div>
                  <div className="text-blue-400 font-mono mt-2 uppercase tracking-tighter">Vectorized Memory</div>
               </div>
               
               {/* Orbital elements */}
               <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
