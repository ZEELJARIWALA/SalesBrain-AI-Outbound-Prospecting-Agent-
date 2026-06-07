import os
import logging
from typing import List, Dict, Any, Optional
from hindsight_client import Hindsight
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class HindsightService:
    def __init__(self):
        self.api_key = os.getenv("HINDSIGHT_API_KEY")
        self.project_id = os.getenv("HINDSIGHT_PROJECT_ID")
        # In the official client, Hindsight class requires a base_url.
        self.client = Hindsight(
            base_url="https://api.hindsight.vectorize.io", 
            api_key=self.api_key
        )
        self.memory_bank_id = self.project_id 

    async def add_memory(self, content: str, metadata: Dict[str, Any]):
        """
        Stores a new memory in Hindsight.
        """
        try:
            print(f"DEBUG: Attempting to store in Hindsight Bank '{self.memory_bank_id}'...")
            print(f"DEBUG: Content: {content}")
            
            await self.client.aretain(
                bank_id=self.memory_bank_id,
                content=content
            )
            print("DEBUG: ✅ Successfully sent to Hindsight!")
            return True
        except Exception as e:
            print(f"DEBUG: ❌ Hindsight Error: {str(e)}")
            logger.error(f"Failed to add memory to Hindsight: {str(e)}")
            return False

    async def search_memory(self, query: str, top_k: int = 10) -> str:
        """
        Searches Hindsight for relevant memories and returns a combined context string.
        """
        try:
            logger.info(f"Searching Hindsight for: {query}")
            results = await self.client.arecall(
                bank_id=self.memory_bank_id,
                query=query
            )
            # Combine results into a context string
            if isinstance(results, list):
                return "\n".join([str(res) for res in results])
            return str(results)
        except Exception as e:
            logger.error(f"Hindsight search failed: {str(e)}")
            return "Error retrieving memories from Hindsight."

# Singleton instance
hindsight = HindsightService()
