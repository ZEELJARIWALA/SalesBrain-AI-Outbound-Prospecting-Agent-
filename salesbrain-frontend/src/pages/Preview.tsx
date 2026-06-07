import React, { useState } from 'react';
import { BarChart3, ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, Loader2, Info } from 'lucide-react';
import { intelligenceService } from '../services/api';
import type { LaunchPreviewResponse } from '../types';
import { clsx } from 'clsx';

const Preview: React.FC = () => {
  const [formData, setFormData] = useState({ persona: '', industry: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LaunchPreviewResponse | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.persona || !formData.industry || !formData.message) return;
    
    setLoading(true);
    setResult(null);
    try {
      const data = await intelligenceService.evaluate(formData.persona, formData.industry, formData.message);
      setResult(data);
    } catch (err) {
      console.error("Evaluation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-32 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4 pt-8">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 size={32} />
        </div>
        <h2 className="text-4xl font-black tracking-tight">Adaptive Sales Coach</h2>
        <p className="text-muted-foreground max-w-xl mx-auto italic font-medium">
          "Evaluate your message against your SalesBrain memory BEFORE you launch. Stop burning prospects with bad hooks."
        </p>
      </div>

      <div className="bg-card border border-border p-10 rounded-[3rem] shadow-sm">
        <form onSubmit={handleEvaluate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Target Persona</label>
              <input 
                type="text" 
                placeholder="CEO, Founder, etc."
                className="w-full bg-secondary/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium italic"
                value={formData.persona}
                onChange={e => setFormData({ ...formData, persona: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Industry</label>
              <input 
                type="text" 
                placeholder="Enterprise Tech"
                className="w-full bg-secondary/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all font-medium italic"
                value={formData.industry}
                onChange={e => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Proposed Hook / Message</label>
            <textarea 
              placeholder="Enter the main hook of your email here..."
              rows={4}
              className="w-full bg-secondary/50 border-none rounded-3xl p-6 focus:ring-2 focus:ring-primary transition-all font-medium italic resize-none"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-2xl p-4 font-bold h-[58px] shadow-lg shadow-blue-600/20 hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Evaluate Campaign
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
           {/* Evaluation Result Banner */}
           <div className={clsx(
              "p-10 rounded-[3rem] border flex flex-col md:flex-row items-center gap-10",
              result.risk_level === 'high' ? "bg-red-50 border-red-100" : 
              result.risk_level === 'medium' ? "bg-amber-50 border-amber-100" : 
              "bg-emerald-50 border-emerald-100"
           )}>
              <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      className={clsx(
                        result.risk_level === 'high' ? "text-red-100" : 
                        result.risk_level === 'medium' ? "text-amber-100" : 
                        "text-emerald-100"
                      )}
                    />
                    <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={452.4}
                      strokeDashoffset={452.4 - (452.4 * result.campaign_score) / 100}
                      strokeLinecap="round"
                      className={clsx(
                        "transition-all duration-1000",
                        result.risk_level === 'high' ? "text-red-500" : 
                        result.risk_level === 'medium' ? "text-amber-500" : 
                        "text-emerald-500"
                      )}
                    />
                 </svg>
                 <div className="absolute text-center">
                    <span className="text-4xl font-black block">{result.campaign_score}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Success Score</span>
                 </div>
              </div>

              <div className="space-y-4 text-center md:text-left">
                 <div className={clsx(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                    result.risk_level === 'high' ? "bg-red-500 text-white" : 
                    result.risk_level === 'medium' ? "bg-amber-500 text-white" : 
                    "bg-emerald-500 text-white"
                 )}>
                    {result.risk_level} Risk Level Detected
                 </div>
                 <h3 className="text-2xl font-black italic">
                    {result.risk_level === 'high' ? "This message is a high-risk gamble." : 
                     result.risk_level === 'medium' ? "Proceed with caution and testing." : 
                     "Great work! This message has strong patterns."}
                 </h3>
                 <p className="text-muted-foreground italic font-medium">
                    "Based on our vector indexing of your past 150+ outreach interactions, we've identified specific warnings for this persona."
                 </p>
              </div>
           </div>

           {/* Warnings & Suggestions */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-6">
                 <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle size={20} />
                    <h4 className="font-black uppercase tracking-widest text-sm">Critical Warnings</h4>
                 </div>
                 <div className="space-y-4">
                    {result.warnings.map((w, i) => (
                       <div key={i} className="flex gap-4 text-sm font-medium italic text-muted-foreground">
                          <span className="text-red-500 font-bold shrink-0">!</span>
                          {w}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white space-y-6">
                 <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <h4 className="font-black uppercase tracking-widest text-sm">Coach Recommendation</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] uppercase font-bold text-emerald-400 mb-2">Switch to this Hook</p>
                       <p className="italic font-bold text-lg leading-tight">"{result.recommended_alternative}"</p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                       <span className="text-xs font-medium opacity-60 italic">Expected Response Rate:</span>
                       <span className="text-xl font-black text-emerald-400">{result.expected_response_rate}%</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-secondary/50 rounded-2xl border border-border flex items-start gap-4">
              <Info className="text-primary mt-1 shrink-0" size={20} />
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                 <strong>Adaptive Learning Note:</strong> This evaluation was generated by cross-referencing your proposed message against semantic clusters of historical "Failures" and "Successes" specifically for the <strong>{formData.persona}</strong> segment.
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
