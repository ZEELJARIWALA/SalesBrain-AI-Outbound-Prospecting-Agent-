from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List

class CampaignBase(BaseModel):
    persona: str = Field(..., example="Startup Founder")
    industry: str = Field(..., example="SaaS")
    message: str = Field(..., example="Save 10 hours/week")
    response_rate: float = Field(..., example=42.0)
    meetings_booked: int = Field(..., example=8)

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.now)

class QueryRequest(BaseModel):
    question: str = Field(..., example="What messaging works best for startup founders?")

class QueryResponse(BaseModel):
    answer: str
    campaigns_analyzed: Optional[int] = 0
    question: str
    context_summary: str

class InteractionType(str):
    reply = "reply"
    objection = "objection"
    meeting_booked = "meeting_booked"

class InteractionRequest(BaseModel):
    type: str # reply, objection, meeting_booked
    persona: str
    content: str
    metadata: Optional[dict] = {}

class RecommendationRequest(BaseModel):
    persona: str
    industry: str

class RecommendationResponse(BaseModel):
    recommended_hook: str
    predicted_response_rate: float
    common_objections: List[str]
    recommended_cta: str

class OutreachRequest(BaseModel):
    persona: str
    industry: str

class OutreachResponse(BaseModel):
    email_subject: str
    email_body: str
    reasoning: List[str]

class CoachingEvaluateRequest(BaseModel):
    persona: str
    industry: str
    message: str

class CoachingEvaluateResponse(BaseModel):
    campaign_score: int
    risk_level: str
    predicted_response_rate: float
    warnings: List[str]
    recommended_hook: str
    expected_response_rate_if_used: float

class PersonaCoachingResponse(BaseModel):
    best_hook: str
    average_response_rate: float
    common_objections: List[str]
    recommended_cta: str

class AnalyticsOverview(BaseModel):
    total_campaigns: int
    total_interactions: int
    meetings_booked: int
    average_response_rate: float

class PersonaAnalytics(BaseModel):
    persona: str
    average_response_rate: float

class HookAnalytics(BaseModel):
    hook: str
    response_rate: float

class ObjectionAnalytics(BaseModel):
    objection: str
    count: int

class MemoryStatistics(BaseModel):
    campaign_memories: int
    objection_memories: int
    meeting_memories: int
    insight_memories: int

class MemoryEffectiveness(BaseModel):
    total_memories: int
    campaign_memories: int
    interaction_memories: int
    insight_memories: int
    recommendations_generated: int

class ExecutiveSummary(BaseModel):
    campaigns: int
    interactions: int
    meetings: int
    top_persona: str
    best_hook: str
    top_objection: str
    average_response_rate: float

class IntelligenceResponse(BaseModel):
    campaign_score: int
    risk_level: str
    best_hook: str
    predicted_response_rate: float
    recommended_cta: str
    common_objections: List[str]
    objection_rebuttals: List[str]
    generated_email_subject: str
    generated_email_body: str
    historical_reasoning: List[str]

class LaunchPreviewResponse(BaseModel):
    campaign_score: int
    risk_level: str
    warnings: List[str]
    recommended_alternative: str
    expected_response_rate: float

class DemoScenarioRequest(BaseModel):
    persona: str
    industry: str
