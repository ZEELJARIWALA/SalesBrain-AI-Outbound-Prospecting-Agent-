import React, { useState } from 'react';
import { HelpCircle, Play, Sparkles, Database, Brain, ArrowRight, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { intelligenceService } from '../services/api';
import type { IntelligenceResponse } from '../types';

const Demo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntelligenceResponse | null>(null);

  const runDemo = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Demo scenario: SaaS Founder in Enterprise Tech
      const data = await intelligenceService.runDemo("Startup Founder", "Enterprise SaaS");
      setResult(data);
    } catch (err) {
      console.error("Demo failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-32 max-w-6xl mx-auto space-y-16">
      <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden text-center md:text-left">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-blue-600/10 pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary-foreground text-sm font-bold border border-white/20">
                   <HelpCircle size={18} />
                   Judge & Demo Mode
                </div>
                <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                   See the Brain <br /> <span className="text-primary italic">In Action.</span>
                </h2>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-lg italic">
                  "Click the button below to simulate a complete memory-powered prospecting lifecycle for a Startup Founder target."
                </p>
                <button 
                  disabled={loading}
                  onClick={runDemo}
                  className="px-12 py-6 bg-primary text-white rounded-3xl font-black text-2xl shadow-2xl shadow-primary/40 hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-3 animate-pulse"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Play fill="white" /> Run Demo Scenario</>}
                </button>
             </div>
             <div className="hidden md:flex flex-col gap-4">
                {[
                  { icon: Database, label: "Indexing Memory..." },
                  { icon: Brain, label: "Retrieving Patterns..." },
                  { icon: Sparkles, label: "Generating Intelligence..." },
                ].map((step, i) => (
                   <div key={i} className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                         <step.icon size={20} />
                      </div>
                      <span className="font-bold italic text-lg">{step.label}</span>
                   </div>
                ))}
             </div>
          </div>
      </div>

      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-20 duration-1000">
           <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <h3 className="text-xl font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <Sparkles className="text-primary" />
                 Demo Results
              </h3>
              <div className="h-px flex-1 bg-border" />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-card border border-border p-8 rounded-[2.5rem]">
                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">Scenario Profile</div>
                    <div className="space-y-6">
                       <div>
                          <p className="text-xs font-bold text-primary mb-1">Target Persona</p>
                          <p className="text-2xl font-black italic">Startup Founder</p>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-primary mb-1">Industry</p>
                          <p className="text-2xl font-black italic">Enterprise SaaS</p>
                       </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Historical Matches</p>
                          <p className="text-xl font-black italic">42 Campaigns</p>
                       </div>
                       <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 font-black">
                          {result.campaign_score}%
                       </div>
                    </div>
                 </div>

                 {/* Logic Flow */}
                 <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-border space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                       <Info className="text-primary" size={18} />
                       <span className="text-xs font-bold uppercase tracking-widest">Reasoning Logic</span>
                    </div>
                    <div className="space-y-6">
                       {result.historical_reasoning.map((r, i) => (
                          <div key={i} className="flex gap-4">
                             <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                {i+1}
                             </div>
                             <p className="text-sm font-medium italic text-muted-foreground">{r}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-8 space-y-8">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2.5rem] space-y-4">
                       <p className="text-xs font-black uppercase text-primary tracking-widest">Recommended Hook</p>
                       <h4 className="text-2xl font-bold italic leading-tight">"{result.best_hook}"</h4>
                    </div>
                     <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 p-8 rounded-[2.5rem] space-y-4">
                       <p className="text-xs font-black uppercase text-emerald-600 tracking-widest">Best CTA</p>
                       <h4 className="text-2xl font-bold italic leading-tight">"{result.recommended_cta}"</h4>
                    </div>
                 </div>

                 <div className="bg-card border border-border p-10 rounded-[3rem] space-y-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-black italic">Optimized Outreach Draft</h3>
                       <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase">
                          <CheckCircle2 size={12} />
                          Memory Verified
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="p-4 bg-secondary/50 rounded-2xl border-l-4 border-primary font-bold italic">
                          Subject: {result.generated_email_subject}
                       </div>
                       <div className="p-10 bg-secondary/20 rounded-[2rem] border border-border italic font-medium leading-relaxed whitespace-pre-wrap">
                          {result.generated_email_body}
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-8 bg-red-50/50 dark:bg-red-900/5 rounded-3xl border border-red-100 dark:border-red-900/10">
                       <h5 className="text-[10px] font-black uppercase tracking-tighter text-red-600 mb-4">Observed Pushback</h5>
                       <ul className="space-y-3">
                          {result.common_objections.slice(0, 3).map((o, i) => (
                             <li key={i} className="text-sm font-medium italic opacity-70 flex items-center gap-2">
                                <div className="w-1 h-1 bg-red-500 rounded-full" /> {o}
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div className="p-8 bg-emerald-50/50 dark:bg-emerald-900/5 rounded-3xl border border-emerald-100 dark:border-emerald-900/10">
                       <h5 className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 mb-4">Handling Strategy</h5>
                       <ul className="space-y-3">
                          {result.objection_rebuttals.slice(0, 3).map((r, i) => (
                             <li key={i} className="text-sm font-medium italic opacity-70 flex items-center gap-2">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full" /> {r}
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Demo;
