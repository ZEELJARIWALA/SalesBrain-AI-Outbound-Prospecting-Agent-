export interface Campaign {
  persona: string;
  industry: string;
  message: string;
  response_rate: number;
  meetings_booked: number;
}

export interface Interaction {
  type: 'reply' | 'objection' | 'meeting_booked';
  persona: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface ExecutiveSummary {
  campaigns: number;
  interactions: number;
  meetings: number;
  top_persona: string;
  best_hook: string;
  top_objection: string;
  average_response_rate: number;
}

export interface PersonaAnalytics {
  persona: string;
  average_response_rate: number;
}

export interface HookAnalytics {
  hook: string;
  response_rate: number;
}

export interface ObjectionAnalytics {
  objection: string;
  count: number;
}

export interface MemoryStats {
  campaign_memories: number;
  objection_memories: number;
  meeting_memories: number;
  insight_memories: number;
}

export interface IntelligenceResponse {
  campaign_score: number;
  risk_level: 'low' | 'medium' | 'high';
  best_hook: string;
  predicted_response_rate: number;
  recommended_cta: string;
  common_objections: string[];
  objection_rebuttals: string[];
  generated_email_subject: string;
  generated_email_body: string;
  historical_reasoning: string[];
}

export interface LaunchPreviewResponse {
  campaign_score: number;
  risk_level: 'low' | 'medium' | 'high';
  warnings: string[];
  recommended_alternative: string;
  expected_response_rate: number;
}
