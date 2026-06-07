# SalesBrain AI Backend - Phase 5 (Recommendation Engine)

Advanced memory-powered outbound prospecting backend with automated strategy recommendation and outreach generation.

... (existing headers) ...

### 5. Recommendation Engine (NEW)
The system now uses historical metrics and objections to predict the best way to open a sales conversation.

**POST** `/recommend`
Generates a strategy including the best hook and predicted response rate.

**POST** `/generate-outreach`
Generates a fully custom email draft based on what has historically worked for researchers.

**GET** `/recommendation/persona/{persona}`
Quickly see the best strategy for a specific buyer persona.

### How it works:
1.  **Metric Analysis**: Finds campaigns with the highest response rates in Hindsight.
2.  **Objection Avoidance**: Scans interactions for common objections to adjust the messaging.
3.  **Pattern Matching**: Leverages Groq to identify why certain hooks worked better than others based on your "SalesBrain" memory.
