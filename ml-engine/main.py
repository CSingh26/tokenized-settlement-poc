#Imports
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pandas as pd
import joblib

#Load trained model
model = joblib.load("trainedModels/XGBoost.pkl")

app = FastAPI()

#Input schema
class TxnData(BaseModel):
    amt: float
    assest: str  

@app.post("/score")
def score(txn: TxnData):
    valid_assets = {"BOND", "USD", "FX"}
    if txn.assest.upper() not in valid_assets:
        return {"error": f"Invalid asset type. Valid types: {', '.join(valid_assets)}"}

    X = pd.DataFrame([[txn.amt]], columns=["amount"])
    pred = model.predict(X)[0]
    prob = model.predict_proba(X)[0][1]

    return {
        "isFraud": bool(pred),
        "fraudProbability": round(float(prob), 4)
    }
