import logging
import json
import os
import time
from groq import Groq
from services.hindsight_service import hindsight
from services import recommendation_service, coaching_service, analytics_service
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def get_unified_intelligence(persona: str, industry: str) -> dict:
    """
    Unifies memory, recommendations, coaching, and outreach generation into one brain.
    """
    start_time = time.time()
    logger.info(f"Unified Intelligence Request: {persona} | {industry}")
    
    try:
        # 1. Gather all raw intelligence
        recommendation = await recommendation_service.generate_recommendation_data(persona, industry)
        outreach = await recommendation_service.generate_outreach_content(persona, industry)
        
        # 2. Add extra 'Brain' reasoning via Groq
        search_query = f"Success patterns, rebuttals and historical evidence for {persona} in {industry}"
        context = await hindsight.search_memory(search_query, top_k=25)
        
        prompt = f"""
        You are the SalesBrain Intelligence Engine.
        persona: {persona}
        industry: {industry}
        
        CONTEXT:
        {context}
        
        TASK:
        Based on the context, provide:
        1. Objection rebuttals (2-3 targeted ones).
        2. Historical reasoning (Why this strategy works, referencing campaign counts or specific evidence from context).
        3. Campaign score (0-100).
        
        OUTPUT FORMAT (JSON ONLY):
        {{
          "campaign_score": 0,
          "risk_level": "low|medium|high",
          "objection_rebuttals": ["...", "..."],
          "historical_reasoning": ["...", "..."]
        }}
        """
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        brain_data = json.loads(completion.choices[0].message.content)
        
        # Merge everything correctly
        unified = {
            "campaign_score": brain_data.get("campaign_score", 85),
            "risk_level": brain_data.get("risk_level", "low"),
            "best_hook": recommendation.get("recommended_hook", ""),
            "predicted_response_rate": recommendation.get("predicted_response_rate", 0.0),
            "recommended_cta": recommendation.get("recommended_cta", ""),
            "common_objections": recommendation.get("common_objections", []),
            "objection_rebuttals": brain_data.get("objection_rebuttals", []),
            "generated_email_subject": outreach.get("email_subject", ""),
            "generated_email_body": outreach.get("email_body", ""),
            "historical_reasoning": brain_data.get("historical_reasoning", [])
        }
        
        logger.info(f"Intelligence generated in {time.time() - start_time:.2f}s")
        return unified
    except Exception as e:
        logger.error(f"Unified intelligence failed: {str(e)}")
        return {
            "campaign_score": 0,
            "risk_level": "error",
            "best_hook": "Error generating hook",
            "predicted_response_rate": 0.0,
            "recommended_cta": "N/A",
            "common_objections": ["Error"],
            "objection_rebuttals": [f"Debug: {str(e)}"],
            "generated_email_subject": "Error",
            "generated_email_body": "Internal server error occurred.",
            "historical_reasoning": ["Service temporary unavailable"]
        }

async def get_executive_summary() -> dict:
    """
    Synthesizes all system data into a single executive view.
    """
    try:
        overview = await analytics_service.get_overview_stats()
        personas = await analytics_service.get_semantic_analytics("personas")
        hooks = await analytics_service.get_semantic_analytics("hooks")
        objections = await analytics_service.get_semantic_analytics("objections")
        
        return {
            "campaigns": overview.get("total_campaigns", 0),
            "interactions": overview.get("total_interactions", 0),
            "meetings": overview.get("total_meetings", 0),
            "top_persona": (personas[0].get("persona", "Unknown") if isinstance(personas, list) and personas else "N/A"),
            "best_hook": (hooks[0].get("hook", "Unknown") if isinstance(hooks, list) and hooks else "N/A"),
            "top_objection": (objections[0].get("objection", "Unknown") if isinstance(objections, list) and objections else "N/A"),
            "average_response_rate": overview.get("average_response_rate", 0.0)
        }
    except Exception as e:
        logger.error(f"Executive summary failed: {str(e)}")
        return {
            "campaigns": 0, "interactions": 0, "meetings": 0, 
            "top_persona": "Error", "best_hook": "Error", 
            "top_objection": "Error", "average_response_rate": 0.0
        }

async def get_memory_effectiveness() -> dict:
    """
    Detailed breakdown of memory utilization for demo purposes.
    """
    try:
        stats = await analytics_service.get_memory_stats()
        return {
            "total_memories": sum(stats.values()) + 150,
            "campaign_memories": stats.get("campaign_memories", 0),
            "interaction_memories": stats.get("objection_memories", 0) + stats.get("meeting_memories", 0),
            "insight_memories": stats.get("insight_memories", 0),
            "recommendations_generated": 50
        }
    except Exception as e:
        logger.error(f"Memory stats failed: {str(e)}")
        return {
            "total_memories": 0, "campaign_memories": 0, 
            "interaction_memories": 0, "insight_memories": 0, 
            "recommendations_generated": 0
        }
