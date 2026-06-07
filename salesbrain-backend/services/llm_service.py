import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_response(context: str, question: str, num_campaigns: int) -> dict:
    """
    Generates a response using Groq if GROQ_API_KEY is set, otherwise returns a mock response.
    """
    api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key or api_key == "your_groq_api_key_here":
        # Fallback to Mock logic for Phase 1 testing
        summary = f"Mock Analysis: Found {num_campaigns} campaigns."
        answer = (
            f" [MOCK MODE] Based on {num_campaigns} campaigns: "
            f"Personality and industry data suggest localized messaging is effective. "
            f"Your question was: {question}."
        )
        return {
            "answer": answer,
            "campaigns_analyzed": num_campaigns,
            "question": question,
            "context_summary": summary
        }

    # Real Groq Integration
    try:
        system_prompt = (
            "You are a SalesBrain AI assistant. You analyze past outbound prospecting campaigns "
            "to give advice on messaging and strategy. Use the provided context to answer the user's question."
        )
        
        user_prompt = f"Context:\n{context}\n\nQuestion: {question}"
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        
        answer = completion.choices[0].message.content
        summary = f"AI Analysis: Processed {num_campaigns} campaigns via Groq."
        
        return {
            "answer": answer,
            "campaigns_analyzed": num_campaigns,
            "question": question,
            "context_summary": summary
        }
    except Exception as e:
        return {
            "answer": f"Error calling Groq API: {str(e)}",
            "campaigns_analyzed": num_campaigns,
            "question": question,
            "context_summary": "Error occurred during AI generation."
        }
