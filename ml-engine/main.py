from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import IsolationForest

app = FastAPI()

# Simulated training data
model = IsolationForest(contamination=0.1)
model.fit([[100], [200], [150], [130], [170]])

class TxnData(BaseModel):
    amount: float

@app.post("/score")
def score(txn: TxnData):
    X = np.array([[txn.amount]])
    score = model.decision_function(X)[0]
    anomaly = model.predict(X)[0] == -1
    return {
        "risk_score": float(score),       # ✅ convert from np.float64
        "is_anomaly": bool(anomaly)       # ✅ convert from np.bool_
    }
