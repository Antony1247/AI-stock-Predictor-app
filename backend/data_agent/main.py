# from fastapi import FastAPI, HTTPException
# from collector import fetch_stock_data

# app = FastAPI()

# @app.get("/stock_data/{symbol}")
# def get_stock_data(symbol: str):
#     try:
#         data = fetch_stock_data(symbol)
#         return {"symbol": symbol, "data": data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# backend/nse_live_api.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import pandas as pd

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{symbol}")
def get_nse_stock(symbol: str):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    url = f"https://www.nseindia.com/api/quote-equity?symbol={symbol.upper()}"

    try:
        session = requests.Session()
        session.headers.update(headers)
        session.get("https://www.nseindia.com", timeout=5)  # Get cookies
        res = session.get(url, timeout=5)

        data = res.json()
        price = data['priceInfo']['lastPrice']
        day_high = data['priceInfo']['intraDayHighLow']['max']
        day_low = data['priceInfo']['intraDayHighLow']['min']
        timestamp = data['metadata']['lastUpdateTime']

        return {
            "symbol": symbol.upper(),
            "price": price,
            "high": day_high,
            "low": day_low,
            "timestamp": timestamp
        }
    except Exception as e:
        return {"error": str(e)}
