import os
import feedparser
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import ollama
import re

# Set Ollama host to host machine
os.environ["OLLAMA_HOST"] = "http://host.docker.internal:11434"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SentimentRequest(BaseModel):
    symbol: str
    company: str

def get_headlines(symbol: str):
    query = symbol.split(".")[0] + "+stock"
    feed_url = f"https://news.google.com/rss/search?q={query}"
    feed = feedparser.parse(feed_url)
    return [entry.title for entry in feed.entries[:30]]

def get_score_and_report(company: str, headlines: list[str]) -> dict:
    if not headlines:
        return {"score": 0, "report": "No news found.", "good_news": [], "bad_news": []}

    news_text = "\n".join(f"- {headline}" for headline in headlines)

    prompt = f"""
You are a sentiment analysis AI.

Company: {company}
Headlines:
{news_text}

Tasks:
1. Analyze the sentiment of these headlines.
2. Score overall sentiment from -10 (very negative) to +10 (very positive).
3. Categorize each headline as "Good News" or "Bad News".
4. Provide a brief report summarizing the sentiment.

Format:
Sentiment Score: <score>
Report: <summary>
Good News:
- <positive headline>
- ...
Bad News:
- <negative headline>
- ...
Only return in the format above.
"""

    try:
        response = ollama.chat(
            model="deepseek-r1:7b",
            messages=[
                {"role": "system", "content": "You are a precise sentiment analyzer. Follow the instructions exactly and only return structured output."},
                {"role": "user", "content": prompt.strip()}
            ],
            options={"temperature": 0}
        )

        content = response["message"]["content"]

        score_match = re.search(r"Sentiment Score:\s*(-?\d+\.?\d*)", content)
        score = float(score_match.group(1)) if score_match else 0.0

        report_match = re.search(r"Report:\s*(.*?)\nGood News:", content, re.DOTALL)
        report = report_match.group(1).strip() if report_match else "No report available."

        good_news = re.findall(r"Good News:\s*((?:- .*\n?)*)", content)
        bad_news = re.findall(r"Bad News:\s*((?:- .*\n?)*)", content)

        def clean_items(news_section):
            if not news_section:
                return []
            return [line[2:].strip() for line in news_section[0].strip().splitlines() if line.startswith("- ")]

        return {
            "score": score,
            "report": report,
            "good_news": clean_items(good_news),
            "bad_news": clean_items(bad_news),
        }

    except Exception as e:
        print("Error during sentiment analysis:", e)
        return {
            "score": 0,
            "report": "An error occurred during analysis.",
            "good_news": [],
            "bad_news": [],
        }

@app.post("/analyze")
def analyze_sentiment(req: SentimentRequest):
    headlines = get_headlines(req.symbol)
    result = get_score_and_report(req.company, headlines)
    return result
