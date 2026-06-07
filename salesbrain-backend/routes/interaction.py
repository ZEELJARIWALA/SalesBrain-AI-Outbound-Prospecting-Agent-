from fastapi import APIRouter, HTTPException
from models.schemas import InteractionRequest
from services import hindsight_service
import logging

router = APIRouter(tags=["Interaction"])
logger = logging.getLogger(__name__)

@router.post("/interaction")
async def create_interaction(request: InteractionRequest):
    """
    Stores an interaction (reply, objection, meeting_booked) in Hindsight.
    """
    try:
        content = f"Interaction: {request.type} for persona {request.persona}. Details: {request.content}"
        metadata = {
            "type": request.type,
            "persona": request.persona,
            **request.metadata
        }
        
        success = await hindsight_service.hindsight.add_memory(content, metadata)
        
        if success:
            return {"message": "Interaction saved successfully", "type": request.type}
        else:
            raise HTTPException(status_code=500, detail="Failed to store interaction in Hindsight")
            
    except Exception as e:
        logger.error(f"Error saving interaction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
