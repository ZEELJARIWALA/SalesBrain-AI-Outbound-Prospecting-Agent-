import logging
import json
import os
from groq import Groq
from services.hindsight_service import hindsight
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def evaluate_campaign_strategy(persona: str, industry: str, message: str) -> dict:
    """
    Evaluate a proposed campaign message against Hindsight memory.
    """
    search_query = f"Campaign performance, messaging hooks, and objections for {persona} in {industry}"
    context = await hindsight.search_memory(search_query, top_k=20)
    
    prompt = f"""
    You are an Adaptive Sales Coach. Evaluate the following proposed campaign:
    - Persona: {persona}
    - Industry: {industry}
    - Proposed Message: {message}
    
    HISTORICAL CONTEXT:
    {context}
    
    TASK:
    Analyze the proposed message against historical successes and failures in the context.
    Calculate a confidence score (0-100), identify risks (e.g. too aggressive, low response themes), 
    predict response rate, and suggest a better alternative if needed.
    
    OUTPUT FORMAT (JSON ONLY):
    {{
      "campaign_score": 0,
      "risk_level": "low|medium|high",
      "predicted_response_rate": 0.0,
      "warnings": ["...", "..."],
      "recommended_hook": "...",
      "expected_response_rate_if_used": 0.0
    }}
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        logger.error(f"Campaign evaluation failed: {str(e)}")
        return {{
            "campaign_score": 50,
            "risk_level": "medium",
            "predicted_response_rate": 10.0,
            "warnings": ["Could not retrieve historical comparison data."],
            "recommended_hook": "Standard value proposition",
            "expected_response_rate_if_used": 15.0
        }}

async def get_persona_coaching_insights(persona: str) -> dict:
    """
    Retrieve coaching insights for a specific persona.
    """
    search_query = f"High performing hooks, CTAs and common objections for {persona}"
    context = await hindsight.search_memory(search_query, top_k=15)
    
    prompt = f"""
    Analyze the context to provide coaching insights for targeting "{persona}".
    
    CONTEXT:
    {context}
    
    OUTPUT FORMAT (JSON ONLY):
    {{
      "best_hook": "...",
      "average_response_rate": 0.0,
      "common_objections": ["...", "..."],
      "recommended_cta": "..."
    }}
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        logger.error(f"Persona coaching retrieval failed: {str(e)}")
        return {{
            "best_hook": "Focus on high-level ROI",
            "average_response_rate": 18.5,
            "common_objections": ["Budget constraints", "Timing"],
            "recommended_cta": "Brief introductory call"
        }}
