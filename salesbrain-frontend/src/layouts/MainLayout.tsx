import React from 'react';
import { LayoutDashboard, Brain, Rocket, BarChart3, HelpCircle, Menu, X, Code } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Rocket },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'studio', label: 'Intelligence Studio', icon: Brain },
    { id: 'preview', label: 'Campaign Coach', icon: BarChart3 },
    { id: 'demo', label: 'Judge Demo', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-card border-r border-border h-screen sticky top-0">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
            <Brain size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SalesBrain AI</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon size={18} className={cn(activeTab === item.id ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-secondary/50 rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Code size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Hindsight SDK</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Powered by Hindsight Vector Memory for historical learning and semantic retrieval.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Brain className="text-primary" />
          <span className="font-bold">SalesBrain AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-20">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium",
                  activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon size={24} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50/50 dark:bg-background">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
