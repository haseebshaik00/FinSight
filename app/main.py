from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List,Literal
import numpy as np
import os
import pandas as pd
from asset_allocation import run_pipeline
from keras.models import load_model
import joblib 
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "ml-engine/savings_lstm_model.h5")
print("Loading model from:", model_path)
model = load_model(model_path)
scaler_path = os.path.join(BASE_DIR, "ml-engine/savings_scaler.pkl")
print("Loading scaler from:", scaler_path)
RISK_LEVELS = ["Conservative", "Balanced", "Aggressive"]

class AllocationRequest(BaseModel):
    savings: float
    risk_profile: Literal["Conservative", "Balanced", "Aggressive"]


# Request schemas
class Transaction(BaseModel):
    date: str
    amount: float

class ForecastRequest(BaseModel):
    income: float
    transactions: List[Transaction]

# Compute monthly savings
def calculate_monthly_savings(income, transactions):
    df = pd.DataFrame([t.dict() for t in transactions])
    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.to_period("M")
    monthly_exp = df.groupby("month")["amount"].sum()
    savings = income - monthly_exp
    return savings.fillna(income).tolist()

@app.post("/api/forecast")
async def forecast(req: ForecastRequest):
    try:
        # Load scaler here
        scaler_path = os.path.join(BASE_DIR, "ml-engine/savings_scaler.pkl")
        if not os.path.exists(scaler_path):
            raise FileNotFoundError("Scaler file not found.")
        scaler = joblib.load(scaler_path)

        savings = calculate_monthly_savings(req.income, req.transactions)

        if len(savings) < 3:
            return {"error": "At least 3 months of transaction data is required."}

        # Normalize and prepare last 3-month sequence
        scaled_savings = scaler.transform(np.array(savings).reshape(-1, 1))
        last_seq = scaled_savings[-3:].reshape(1, 3, 1)

        # Predict next 6 months
        preds = []
        for _ in range(6):
            pred = model.predict(last_seq)[0][0]
            preds.append(pred)
            last_seq = np.append(last_seq[:, 1:, :], [[[pred]]], axis=1)

        forecasted = scaler.inverse_transform(np.array(preds).reshape(-1, 1)).flatten()
        today = datetime.today().replace(day=1)
        months = [(today + timedelta(days=30 * i)).strftime("%Y-%m") for i in range(1, 7)]

        return [{"month": m, "predicted_savings": round(float(s), 2)} for m, s in zip(months, forecasted)]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast failed: {str(e)}")

    
@app.post("/api/asset-allocation")
def get_asset_allocation(req: AllocationRequest):
    try:
        output = run_pipeline(req.savings, req.risk_profile)
        return output
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Missing data or model: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Asset allocation failed: {str(e)}")

