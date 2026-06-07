import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Studio from './pages/Studio';
import Preview from './pages/Preview';
import Demo from './pages/Demo';

function App() {
  const [activeTab, setActiveTab] = useState('landing');

  // Change title based on active tab
  useEffect(() => {
    const titles: Record<string, string> = {
      landing: 'SalesBrain AI',
      dashboard: 'Dashboard | SalesBrain AI',
      studio: 'Intelligence Studio | SalesBrain AI',
      preview: 'Campaign Coach | SalesBrain AI',
      demo: 'Judge Demo | SalesBrain AI',
    };
    document.title = titles[activeTab] || 'SalesBrain AI';
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <Landing onStart={setActiveTab} />;
      case 'dashboard':
        return <Dashboard />;
      case 'studio':
        return <Studio />;
      case 'preview':
        return <Preview />;
      case 'demo':
        return <Demo />;
      default:
        return <Landing onStart={setActiveTab} />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;
