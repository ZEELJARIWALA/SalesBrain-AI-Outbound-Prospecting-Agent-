import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import campaign, query, interaction, recommendation, coaching, analytics, intelligence
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SalesBrain AI API",
    description="Backend for SalesBrain AI - Advanced Coaching & Recommendation Intelligence.",
    version="0.6.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Wildcard origins do not support credentials
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(campaign.router)
app.include_router(query.router)
app.include_router(interaction.router)
app.include_router(recommendation.router)
app.include_router(coaching.router)
app.include_router(analytics.router)
app.include_router(intelligence.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to SalesBrain AI API (Phase 6)",
        "engine": "Adaptive Sales Coach",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SalesBrain API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
