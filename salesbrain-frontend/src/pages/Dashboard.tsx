import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { LayoutDashboard, Users, MessageSquare, Calendar, Database, ArrowUpRight, Loader2 } from 'lucide-react';
import { analyticsService } from '../services/api';
import type { ExecutiveSummary, PersonaAnalytics, HookAnalytics, ObjectionAnalytics, MemoryStats } from '../types';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    summary: ExecutiveSummary | null;
    personas: PersonaAnalytics[];
    hooks: HookAnalytics[];
    objections: ObjectionAnalytics[];
    memory: MemoryStats | null;
  }>({
    summary: null,
    personas: [],
    hooks: [],
    objections: [],
    memory: null,
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summary, personas, hooks, objections, memory] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getPersonas(),
          analyticsService.getHooks(),
          analyticsService.getObjections(),
          analyticsService.getMemoryStats()
        ]);
        setData({ summary, personas, hooks, objections, memory });
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-medium italic">Calculating Sales Intelligence...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Campaigns', value: data.summary?.campaigns, icon: LayoutDashboard, trend: '+12%' },
    { label: 'Interactions', value: data.summary?.interactions, icon: MessageSquare, trend: '+24%' },
    { label: 'Meetings Booked', value: data.summary?.meetings, icon: Calendar, trend: '+8%' },
    { label: 'Avg Pulse', value: `${data.summary?.average_response_rate}%`, icon: Users, trend: '+2%' },
  ];

  return (
    <div className="p-8 pb-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-1">Executive Summary</h2>
          <p className="text-muted-foreground italic">"Aggregated performance data from your Hindsight brain."</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-primary/20">
          <Database size={16} />
          Syncing Live
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <stat.icon size={20} />
              </div>
              <div className="flex items-center text-emerald-500 text-xs font-bold leading-none">
                <ArrowUpRight size={14} className="mr-0.5" />
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-3xl font-black">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Personas */}
        <div className="p-8 rounded-[2.5rem] bg-card border border-border">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold italic">Top Personas</h3>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest leading-none">Response Rate (%)</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.personas} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="persona" type="category" width={100} axisLine={false} tickLine={false} fontSize={12} fontStyle="italic" />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="average_response_rate" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Hooks */}
        <div className="p-8 rounded-[2.5rem] bg-card border border-border">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold italic">Winning Hooks</h3>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest leading-none">Efficiency Index</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hooks}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="hook" fontSize={10} fontStyle="italic" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="response_rate" radius={[8, 8, 0, 0]} barSize={32}>
                  {data.hooks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Objections Pie */}
        <div className="lg:col-span-1 p-8 rounded-[2.5rem] bg-card border border-border">
           <h3 className="text-xl font-bold italic mb-8">Objection Frequency</h3>
           <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.objections}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="count"
                  nameKey="objection"
                >
                  {data.objections.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
             {data.objections.slice(0, 3).map((obj, i) => (
               <div key={i} className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2 font-medium">
                   <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                   {obj.objection}
                 </div>
                 <span className="text-muted-foreground italic">{obj.count} hits</span>
               </div>
             ))}
          </div>
        </div>

        {/* Memory Growth */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-card border border-border h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold italic">Memory Effectiveness</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Campaigns
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-purple-500" /> Insights
               </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Fake historical data for nice line visualization */}
              <AreaChart data={[
                { name: 'W1', c: 10, i: 5 },
                { name: 'W2', c: 25, i: 12 },
                { name: 'W3', c: 45, i: 20 },
                { name: 'W4', c: 70, i: 35 },
                { name: 'W5', c: data.memory?.campaign_memories || 90, i: data.memory?.insight_memories || 45 },
              ]}>
                <defs>
                  <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} fontStyle="italic" />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="c" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorC)" />
                <Area type="monotone" dataKey="i" stroke="#a855f7" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
