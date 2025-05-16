from fastapi import FastAPI, HTTPException
from collector import fetch_stock_data

app = FastAPI()

@app.get("/stock_data/{symbol}")
def get_stock_data(symbol: str):
    try:
        data = fetch_stock_data(symbol)
        return {"symbol": symbol, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))