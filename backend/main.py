from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from models import AnalyseRequest, FeedbackReport
from database import get_supabase

load_dotenv()

app = FastAPI(title="GradeLens API")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_mock_feedback() -> list:
    return [
        {
            "id": "critical-analysis",
            "name": "Critical Analysis & Argumentation",
            "weight": 30,
            "currentBand": "Credit",
            "confidenceLevel": 82,
            "diagnosis": "Arguments present but rely on description rather than critical evaluation.",
            "markLoss": "Estimated -8 marks: Distinction requires counter-argument engagement.",
            "suggestions": [
                "Introduce at least two opposing viewpoints and explicitly rebut them.",
                "Move from Author X says to Author X argues, however this overlooks",
                "Add a synthesis paragraph reconciling tension between main sources.",
            ],
        },
        {
            "id": "academic-writing",
            "name": "Academic Writing & Expression",
            "weight": 20,
            "currentBand": "Distinction",
            "confidenceLevel": 91,
            "diagnosis": "Writing is clear and mostly formal; minor colloquialisms reduce academic register.",
            "markLoss": None,
            "suggestions": [
                "Replace a lot of with a significant proportion of.",
                "Avoid second-person, use third-person or passive voice.",
            ],
        },
        {
            "id": "evidence-referencing",
            "name": "Evidence & Referencing",
            "weight": 20,
            "currentBand": "Pass",
            "confidenceLevel": 78,
            "diagnosis": "Only 4 unique sources cited; rubric requires minimum 8 peer-reviewed sources.",
            "markLoss": "Estimated -12 marks: Insufficient source diversity is the largest grade risk.",
            "suggestions": [
                "Add at least 4 more peer-reviewed journal articles from 2018 to 2024.",
                "Ensure every factual claim has an in-text citation.",
                "Check APA 7th edition: page numbers required for direct quotes.",
            ],
        },
        {
            "id": "structure-coherence",
            "name": "Structure & Coherence",
            "weight": 15,
            "currentBand": "Distinction",
            "confidenceLevel": 88,
            "diagnosis": "Logical flow is strong. Minor gap in transition between sections 2 and 3.",
            "markLoss": None,
            "suggestions": [
                "Add a one-sentence signpost at the end of Section 2 previewing Section 3.",
            ],
        },
        {
            "id": "business-application",
            "name": "Application to Business Context",
            "weight": 15,
            "currentBand": "HD",
            "confidenceLevel": 94,
            "diagnosis": "Excellent real-world application with specific industry examples.",
            "markLoss": None,
            "suggestions": [
                "Strong work, consider adding one international comparison.",
            ],
        },
    ]

@app.post("/api/analyse", response_model=FeedbackReport)
async def analyse(request: AnalyseRequest):
    db = get_supabase()
    session_response = db.table("sessions").insert({
        "email": request.email,
        "assignment_type": request.onboarding.assignmentType,
        "word_count_target": request.onboarding.wordCountTarget,
        "due_date": request.onboarding.dueDate,
        "rubric_text": request.rubric_text,
        "draft_text": request.draft_text,
    }).execute()

    if not session_response.data:
        raise HTTPException(status_code=500, detail="Failed to save session")

    session_id = session_response.data[0]["id"]
    criteria = generate_mock_feedback()
    overall_score = 76
    generated_at = datetime.now(timezone.utc).isoformat()

    db.table("feedback_results").insert({
        "session_id": session_id,
        "overall_score": overall_score,
        "criteria_json": criteria,
        "generated_at": generated_at,
    }).execute()

    return FeedbackReport(
        session_id=session_id,
        overallScore=overall_score,
        criteria=criteria,
        generatedAt=generated_at,
    )

@app.get("/api/session/{session_id}")
async def get_session(session_id: str):
    db = get_supabase()
    result = db.table("feedback_results").select(
        "*, sessions(email, assignment_type, due_date)"
    ).eq("session_id", session_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Session not found")
    return result.data[0]

@app.get("/health")
async def health():
    return {"status": "ok", "service": "GradeLens API"}
