from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import numpy as np
from allocationPipeline import run_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SavingsRequest(BaseModel):
    past_savings: List[float]
    expense_by_category: Dict[str, float] = {}

@app.post("/api/savings/forecast")
def forecast_savings(data: SavingsRequest):
    past = np.array(data.past_savings)
    avg = np.mean(past[-3:]) if len(past) >= 3 else np.mean(past)
    future = [round(avg + np.random.normal(0, 50), 2) for _ in range(6)]

    trend = "increasing" if past[-1] > past[0] else "declining"
    summary = f"Your savings trend appears to be {trend}. You're likely to save around ${round(avg)} per month."

    if data.expense_by_category and any(val > 0 for val in data.expense_by_category.values()):
        max_cat = max(data.expense_by_category.items(), key=lambda x: x[1])[0]
        advice = f"You are spending heavily on '{max_cat}' (${data.expense_by_category[max_cat]:.2f}). Consider reducing it for better savings."
    else:
        advice = "Not enough spending data to analyze categories. Try logging expenses more consistently."

    return {
        "forecasted_savings": future,
        "summary_prompt": summary,
        "advice_prompt": advice
    }

class InvestmentRequest(BaseModel):
    amount: float
    risk_profile: str

@app.post("/api/invest")
def get_investment_plan(request: InvestmentRequest):
    allocations = run_pipeline(request.amount, request.risk_profile)
    return {
        "amount": request.amount,
        "risk_profile": request.risk_profile,
        "allocations": allocations
    }