from fastapi import APIRouter, HTTPException
from models.schemas import (
    IntelligenceResponse, 
    DemoScenarioRequest, 
    LaunchPreviewResponse, 
    CoachingEvaluateRequest,
    ExecutiveSummary,
    MemoryEffectiveness
)
from services import sales_intelligence_service, coaching_service
import logging

router = APIRouter(tags=["Intelligence Engine"])
logger = logging.getLogger(__name__)

@router.post("/sales-intelligence", response_model=IntelligenceResponse)
async def post_unified_intelligence(request: DemoScenarioRequest):
    """
    The Master Endpoint: Combines memory, recommendations, coaching, and outreach.
    """
    return await sales_intelligence_service.get_unified_intelligence(request.persona, request.industry)

@router.post("/campaign/launch-preview", response_model=LaunchPreviewResponse)
async def post_launch_preview(request: CoachingEvaluateRequest):
    """
    Proactive evaluate a campaign message before launching it.
    """
    evaluation = await coaching_service.evaluate_campaign_strategy(
        request.persona, request.industry, request.message
    )
    return {
        "campaign_score": evaluation.get("campaign_score", 0),
        "risk_level": evaluation.get("risk_level", "low"),
        "warnings": evaluation.get("warnings", []),
        "recommended_alternative": evaluation.get("recommended_hook", ""),
        "expected_response_rate": evaluation.get("expected_response_rate_if_used", 0.0)
    }

@router.get("/dashboard/executive-summary", response_model=ExecutiveSummary)
async def get_executive_summary():
    """
    Unified summary of all system analytics for the C-suite.
    """
    return await sales_intelligence_service.get_executive_summary()

@router.get("/analytics/memory-effectiveness", response_model=MemoryEffectiveness)
async def get_memory_effectiveness():
    """
    Demonstrates the depth of Hindsight vector memory utilization.
    """
    return await sales_intelligence_service.get_memory_effectiveness()

@router.post("/demo/scenario", response_model=IntelligenceResponse)
async def post_demo_scenario(request: DemoScenarioRequest):
    """
    ONE-CLICK DEMO: Performs every action in the brain for a specific scenario.
    """
    return await sales_intelligence_service.get_unified_intelligence(request.persona, request.industry)
