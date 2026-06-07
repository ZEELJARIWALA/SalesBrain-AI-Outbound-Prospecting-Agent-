from fastapi import APIRouter, HTTPException
from models.schemas import CoachingEvaluateRequest, CoachingEvaluateResponse, PersonaCoachingResponse
from services import coaching_service
import logging

router = APIRouter(tags=["Coaching"])
logger = logging.getLogger(__name__)

@router.post("/campaign/evaluate", response_model=CoachingEvaluateResponse)
async def evaluate_campaign(request: CoachingEvaluateRequest):
    """
    Evaluates a campaign message against historical memory and provides a score + risks.
    """
    logger.info(f"Coaching evaluation started for: {request.persona}")
    try:
        evaluation = await coaching_service.evaluate_campaign_strategy(
            request.persona, request.industry, request.message
        )
        return evaluation
    except Exception as e:
        logger.error(f"Coaching route failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/coaching/persona/{persona}", response_model=PersonaCoachingResponse)
async def get_persona_coaching(persona: str):
    """
    Retrieves aggregated coaching insights (best hook, CTA, objections) for a persona.
    """
    try:
        insights = await coaching_service.get_persona_coaching_insights(persona)
        return insights
    except Exception as e:
        logger.error(f"Persona coaching route failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
