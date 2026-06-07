import json
import os
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from models.schemas import Campaign

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
CAMPAIGNS_FILE = os.path.join(DATA_DIR, "campaigns.json")

def _ensure_data_file():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    if not os.path.exists(CAMPAIGNS_FILE):
        with open(CAMPAIGNS_FILE, "w") as f:
            json.dump([], f)

def save_campaign(campaign_data: Campaign) -> Campaign:
    """Saves a campaign to the JSON file."""
    _ensure_data_file()
    
    campaigns = get_all_campaigns()
    
    # Convert campaign to dict, handling UUID and datetime
    campaign_dict = campaign_data.dict()
    campaign_dict["id"] = str(campaign_dict["id"])
    campaign_dict["created_at"] = campaign_dict["created_at"].isoformat()
    
    campaigns.append(campaign_dict)
    
    with open(CAMPAIGNS_FILE, "w") as f:
        json.dump(campaigns, f, indent=4)
        
    return campaign_data

def get_all_campaigns() -> List[dict]:
    """Retrieves all campaigns from the JSON file."""
    _ensure_data_file()
    
    try:
        with open(CAMPAIGNS_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def search_campaigns(persona: Optional[str] = None) -> List[dict]:
    """Searches campaigns by persona."""
    campaigns = get_all_campaigns()
    if persona:
        return [c for c in campaigns if persona.lower() in c.get("persona", "").lower()]
    return campaigns
