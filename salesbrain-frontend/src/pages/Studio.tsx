import React, { useState } from 'react';
import { Brain, Search, Sparkles, Send, ShieldAlert, CheckCircle2, MessageCircle, Quote, ArrowRight, Loader2 } from 'lucide-react';
import { intelligenceService } from '../services/api';
import type { IntelligenceResponse } from '../types';

const Studio: React.FC = () => {
  const [formData, setFormData] = useState({ persona: '', industry: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntelligenceResponse | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.persona || !formData.industry) return;
    
    setLoading(true);
    setResult(null);
    try {
      const data = await intelligenceService.generate(formData.persona, formData.industry);
      setResult(data);
    } catch (err) {
      console.error("Studio generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-32 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4 pt-8">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Brain size={32} />
        </div>
        <h2 className="text-4xl font-black tracking-tight">Intelligence Studio</h2>
        <p className="text-muted-foreground max-w-xl mx-auto italic font-medium">
          "Unify your campaign memory to generate optimized strategy and high-conversion outreach copy."
        </p>
      </div>

      <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Target Persona</label>
            <input 
              type="text" 
              placeholder="e.g. Startup Founder"
              className="w-full bg-secondary/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium italic"
              value={formData.persona}
              onChange={e => setFormData({ ...formData, persona: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Industry</label>
            <input 
              type="text" 
              placeholder="e.g. SaaS / Marketing"
              className="w-full bg-secondary/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium italic"
              value={formData.industry}
              onChange={e => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-2xl p-4 font-bold h-[58px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                Generate Intelligence
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Top Row: Score & Hook */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex flex-col items-center justify-center text-center space-y-4">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 - (364.4 * result.campaign_score) / 100}
                      className="text-primary stroke-cap-round transition-all duration-1000" 
                    />
                  </svg>
                  <span className="absolute text-3xl font-black">{result.campaign_score}%</span>
               </div>
               <div>
                  <h3 className="text-lg font-bold opacity-70 italic">Campaign Score</h3>
                  <p className="text-xs font-bold uppercase bg-primary/20 text-primary px-3 py-1 rounded-full mt-2 tracking-tighter">
                    {result.risk_level} Risk Strategy
                  </p>
               </div>
            </div>

            <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-card border border-border flex flex-col justify-between">
               <div className="space-y-4">
                 <div className="flex items-center gap-2 text-primary font-bold">
                    <Sparkles size={16} />
                    <span className="text-xs uppercase tracking-widest">Winning Hook</span>
                 </div>
                 <h3 className="text-2xl font-black italic leading-tight">"{result.best_hook}"</h3>
               </div>
               <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Send size={14} className="text-emerald-500" />
                    Recommended CTA: <span className="text-foreground font-black italic">{result.recommended_cta}</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-500">
                    ~{result.predicted_response_rate}% Predicted RR
                  </div>
               </div>
            </div>
          </div>

          {/* Objections & Rebuttals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-8 rounded-[2.5rem] bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30">
               <div className="flex items-center gap-3 text-red-600 mb-6 font-black uppercase tracking-widest text-sm">
                  <ShieldAlert size={20} />
                  Common Objections
               </div>
               <div className="space-y-3">
                  {result.common_objections.map((obj, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-red-100/50 dark:border-red-900/20 italic font-medium">
                       <CheckCircle2 size={16} className="text-red-500 shrink-0" />
                       {obj}
                    </div>
                  ))}
               </div>
             </div>

             <div className="p-8 rounded-[2.5rem] bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30">
               <div className="flex items-center gap-3 text-emerald-600 mb-6 font-black uppercase tracking-widest text-sm">
                  <MessageCircle size={20} />
                  Calculated Rebuttals
               </div>
               <div className="space-y-3">
                  {result.objection_rebuttals.map((reb, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-emerald-100/50 dark:border-emerald-900/20 italic font-medium">
                       <Sparkles size={16} className="text-emerald-500 shrink-0" />
                       {reb}
                    </div>
                  ))}
               </div>
             </div>
          </div>

          {/* Email Content */}
          <div className="p-10 rounded-[3rem] bg-card border border-border shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black italic">Generated Outreach</h3>
                <button className="text-primary font-bold text-sm hover:underline">Copy Draft</button>
             </div>
             
             <div className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-xl border-l-4 border-primary">
                   <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Subject</p>
                   <p className="font-bold">{result.generated_email_subject}</p>
                </div>
                <div className="p-8 bg-secondary/30 rounded-3xl border border-border min-h-[200px] whitespace-pre-wrap leading-relaxed font-medium italic">
                   {result.generated_email_body}
                </div>
             </div>

             <div className="pt-8 border-t border-border">
                <div className="flex items-center gap-2 mb-6">
                   <Quote className="text-primary fill-primary/10" size={20} />
                   <h4 className="text-sm font-black uppercase tracking-widest">Historical Evidence</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {result.historical_reasoning.map((reason, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground p-4 bg-secondary/20 rounded-2xl border border-border hover:border-primary/20 transition-all italic">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                         {reason}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Studio;
