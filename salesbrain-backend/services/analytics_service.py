import logging
import json
import os
from groq import Groq
from services.hindsight_service import hindsight
from services import memory_service
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def get_overview_stats() -> dict:
    """
    Combines JSON data and Hindsight memory to provide a dashboard overview.
    """
    campaigns = memory_service.get_all_campaigns()
    
    total_campaigns = len(campaigns)
    meetings_booked = sum(c.get("meetings_booked", 0) for c in campaigns)
    
    if total_campaigns > 0:
        avg_rate = sum(c.get("response_rate", 0) for c in campaigns) / total_campaigns
    else:
        avg_rate = 0.0
        
    # Estimate interactions from hindsight count (mocked for demo)
    return {
        "total_campaigns": total_campaigns,
        "total_interactions": total_campaigns * 15, # Sample multiplier
        "meetings_booked": meetings_booked,
        "average_response_rate": round(avg_rate, 2)
    }

async def get_semantic_analytics(topic: str) -> any:
    """
    Use AI to aggregate semantic trends from Hindsight.
    """
    context = await hindsight.search_memory(f"Trending {topic} and performance metrics", top_k=30)
    
    prompt = f"""
    Analyze the following memory context and generate a JSON list for the dashboard.
    Topic: {topic}
    
    CONTEXT:
    {context}
    
    OUTPUT FORMAT (JSON ONLY):
    If topic is 'personas': [{{"persona": "...", "average_response_rate": 0.0}}]
    If topic is 'hooks': [{{"hook": "...", "response_rate": 0.0}}]
    If topic is 'objections': [{{"objection": "...", "count": 0}}]
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        data = json.loads(completion.choices[0].message.content)
        return data.get(topic, list(data.values())[0] if data else [])
    except Exception as e:
        logger.error(f"Semantic analytics failed for {topic}: {str(e)}")
        return []

async def get_memory_stats() -> dict:
    """
    Calculate breakdown of memory types in Hindsight.
    """
    # In a real app we'd query Hindsight metadata. For demo, we estimate.
    campaigns = len(memory_service.get_all_campaigns())
    return {
        "campaign_memories": campaigns,
        "objection_memories": campaigns * 2,
        "meeting_memories": sum(c.get("meetings_booked", 0) for c in memory_service.get_all_campaigns()),
        "insight_memories": 15
    }
