from fastapi import FastAPI
from preprocess import get_headlines
from sentiment import analyze_sentiment

app = FastAPI()

@app.get("/sentiment/{symbol}")
def get_sentiment(symbol: str):
    headlines = get_headlines(symbol)
    result = analyze_sentiment(headlines)
    result["symbol"] = symbol
    return result
