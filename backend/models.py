from pydantic import BaseModel
from typing import List, Optional

class OnboardingData(BaseModel):
    assignmentType: str
    wordCountTarget: int
    dueDate: str

class AnalyseRequest(BaseModel):
    email: str
    onboarding: OnboardingData
    rubric_text: str
    draft_text: str

class RubricCriterion(BaseModel):
    id: str
    name: str
    weight: int
    currentBand: str
    confidenceLevel: int
    diagnosis: str
    markLoss: Optional[str] = None
    suggestions: List[str]

class FeedbackReport(BaseModel):
    session_id: str
    overallScore: int
    criteria: List[RubricCriterion]
    generatedAt: str
