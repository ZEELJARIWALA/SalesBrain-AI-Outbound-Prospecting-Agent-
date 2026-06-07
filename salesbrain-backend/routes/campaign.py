from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import Campaign, CampaignCreate
from services import memory_service, hindsight_service

router = APIRouter(tags=["Campaign"])

@router.post("/campaign", response_model=Campaign)
async def create_campaign(campaign_in: CampaignCreate):
    """
    Creates a new campaign and stores it in Hindsight memory.
    """
    try:
        new_campaign = Campaign(**campaign_in.dict())
        
        # 1. Store in Hindsight (Phase 3)
        content = f"Campaign Persona: {new_campaign.persona}. Industry: {new_campaign.industry}. Message: {new_campaign.message}"
        metadata = {
            "type": "campaign",
            "persona": new_campaign.persona,
            "industry": new_campaign.industry,
            "response_rate": new_campaign.response_rate,
            "meetings_booked": new_campaign.meetings_booked,
            "id": str(new_campaign.id)
        }
        await hindsight_service.hindsight.add_memory(content, metadata)
        
        # 2. Backup to JSON (Optional, but keeping for reliability)
        memory_service.save_campaign(new_campaign)
        
        return new_campaign
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save campaign: {str(e)}")

@router.get("/campaigns", response_model=List[dict])
def list_campaigns():
    """
    Returns all stored campaigns from the memory.
    """
    try:
        return memory_service.get_all_campaigns()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve campaigns: {str(e)}")
