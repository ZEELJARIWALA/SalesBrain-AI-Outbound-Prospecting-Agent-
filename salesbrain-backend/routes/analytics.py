from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import AnalyticsOverview, PersonaAnalytics, HookAnalytics, ObjectionAnalytics, MemoryStatistics
from services import analytics_service
import logging

router = APIRouter(prefix="/analytics", tags=["Analytics"])
logger = logging.getLogger(__name__)

@router.get("/overview", response_model=AnalyticsOverview)
async def get_overview():
    """
    Get high-level performance metrics for the main dashboard.
    """
    return await analytics_service.get_overview_stats()

@router.get("/personas", response_model=List[PersonaAnalytics])
async def get_persona_analytics():
    """
    Get top performing personas and their average response rates.
    """
    return await analytics_service.get_semantic_analytics("personas")

@router.get("/hooks", response_model=List[HookAnalytics])
async def get_hook_analytics():
    """
    Get best performing messaging hooks across all campaigns.
    """
    return await analytics_service.get_semantic_analytics("hooks")

@router.get("/objections", response_model=List[ObjectionAnalytics])
async def get_objection_analytics():
    """
    Get the most common objections and their frequency.
    """
    return await analytics_service.get_semantic_analytics("objections")

@router.get("/memory", response_model=MemoryStatistics)
async def get_memory_breakdown():
    """
    Get counts for different types of memories stored in Hindsight.
    """
    return await analytics_service.get_memory_stats()
