import axios from 'axios';
import type { 
  ExecutiveSummary, 
  PersonaAnalytics, 
  HookAnalytics, 
  ObjectionAnalytics, 
  MemoryStats,
  IntelligenceResponse,
  LaunchPreviewResponse 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const analyticsService = {
  getOverview: () => api.get<ExecutiveSummary>('/dashboard/executive-summary').then(res => res.data),
  getPersonas: () => api.get<PersonaAnalytics[]>('/analytics/personas').then(res => res.data),
  getHooks: () => api.get<HookAnalytics[]>('/analytics/hooks').then(res => res.data),
  getObjections: () => api.get<ObjectionAnalytics[]>('/analytics/objections').then(res => res.data),
  getMemoryStats: () => api.get<MemoryStats>('/analytics/memory').then(res => res.data),
};

export const intelligenceService = {
  generate: (persona: string, industry: string) => 
    api.post<IntelligenceResponse>('/sales-intelligence', { persona, industry }).then(res => res.data),
  
  evaluate: (persona: string, industry: string, message: string) => 
    api.post<LaunchPreviewResponse>('/campaign/launch-preview', { persona, industry, message }).then(res => res.data),
    
  runDemo: (persona: string, industry: string) => 
    api.post<IntelligenceResponse>('/demo/scenario', { persona, industry }).then(res => res.data),
};

export default api;
