from fastapi import APIRouter, HTTPException
from models.schemas import QueryRequest, QueryResponse
from services import hindsight_service, llm_service
import logging

router = APIRouter(tags=["Query"])
logger = logging.getLogger(__name__)

@router.post("/query", response_model=QueryResponse)
async def query_knowledge_base(request: QueryRequest):
    """
    Queries the campaign database using Hindsight and Groq.
    """
    try:
        # 1. Search Hindsight for relevant context
        context = await hindsight_service.hindsight.search_memory(
            query=request.question,
            top_k=10
        )
        
        # 2. Call LLM service with retrieved context
        # We pass 0 for num_campaigns as memory count is now dynamic in Hindsight
        result = llm_service.generate_response(
            context=context, 
            question=request.question,
            num_campaigns=0 
        )
        
        return result
    except Exception as e:
        logger.error(f"Query endpoint failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
