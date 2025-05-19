from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from preprocess import get_headlines
from sentiment import analyze_sentiment

app = FastAPI()

# Add this CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <-- for development; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/sentiment/{symbol}")
def get_sentiment(symbol: str):
    headlines = get_headlines(symbol)
    result = analyze_sentiment(headlines)
    result["symbol"] = symbol
    return result
