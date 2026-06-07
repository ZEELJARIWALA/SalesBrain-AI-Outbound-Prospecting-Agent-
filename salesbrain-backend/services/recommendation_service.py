import logging
import json
import os
from groq import Groq
from services.hindsight_service import hindsight
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_recommendation_data(persona: str, industry: str) -> dict:
    """
    Search Hindsight for history and use Groq to generate recommendations.
    """
    search_query = f"Campaigns and interactions for {persona} in {industry}"
    context = await hindsight.search_memory(search_query, top_k=15)
    
    prompt = f"""
    Analyze the following historical sales data and interactions for the persona "{persona}" in the "{industry}" industry.
    
    CONTEXT DATA:
    {context}
    
    TASK:
    Based on the performance data and objections found in the context:
    1. Identify the best performing hook (highest response rate).
    2. Predict a realistic response rate for a new campaign.
    3. List the 2-3 most common objections found.
    4. Recommend the best CTA (e.g., 15-minute call, demo, whitepaper).
    
    OUTPUT FORMAT (JSON ONLY):
    {{
      "recommended_hook": "...",
      "predicted_response_rate": 0.0,
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
        logger.error(f"Recommendation generation failed: {str(e)}")
        return {{
            "recommended_hook": "Save time and scale efficiently",
            "predicted_response_rate": 20.0,
            "common_objections": ["Too expensive", "Not interested"],
            "recommended_cta": "15-minute intro call"
        }}

async def generate_outreach_content(persona: str, industry: str) -> dict:
    """
    Generate highly personalized outreach copy using historical insights.
    """
    search_query = f"Messaging hooks, objections and performance for {persona} in {industry}"
    context = await hindsight.search_memory(search_query, top_k=20)
    
    prompt = f"""
    Create a personalized email for "{persona}" in "{industry}".
    
    HISTORICAL INSIGHTS:
    {context}
    
    RESOURCES TO USE:
    - Use the highest performing hooks from the context.
    - Avoid messaging that led to objections mentioned in the context.
    
    OUTPUT FORMAT (JSON ONLY):
    {{
      "email_subject": "...",
      "email_body": "...",
      "reasoning": ["point 1", "point 2"]
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
        logger.error(f"Outreach generation failed: {str(e)}")
        return {{
            "email_subject": "Quick question for the team",
            "email_body": "Hi there...",
            "reasoning": ["Default fallback due to error"]
        }}
