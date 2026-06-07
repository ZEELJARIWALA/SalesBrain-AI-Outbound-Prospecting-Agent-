from fastapi import APIRouter, HTTPException
from models.schemas import RecommendationRequest, RecommendationResponse, OutreachRequest, OutreachResponse
from services import recommendation_service
import logging

router = APIRouter(tags=["Recommendation"])
logger = logging.getLogger(__name__)

@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendation(request: RecommendationRequest):
    """
    Analyzes memory to recommend the best strategy for a persona/industry.
    """
    logger.info(f"Generating recommendation for {request.persona}")
    try:
        recommendation = await recommendation_service.generate_recommendation_data(
            request.persona, request.industry
        )
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-outreach", response_model=OutreachResponse)
async def generate_outreach(request: OutreachRequest):
    """
    Generates personalized outreach copy based on historical successful patterns.
    """
    logger.info(f"Generating outreach for {request.persona}")
    try:
        outreach = await recommendation_service.generate_outreach_content(
            request.persona, request.industry
        )
        return outreach
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendation/persona/{persona}", response_model=RecommendationResponse)
async def get_persona_recommendation(persona: str):
    """
    Get recommendations for a specific persona across any industry.
    """
    try:
        recommendation = await recommendation_service.generate_recommendation_data(
            persona, "General"
        )
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
