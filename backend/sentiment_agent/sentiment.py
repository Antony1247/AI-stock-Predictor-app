from transformers import pipeline

sentiment_model = pipeline("sentiment-analysis", model="ProsusAI/finbert")

def analyze_sentiment(headlines):
    if not headlines:
        return {
            "sentiment": "neutral",
            "score": 5.0,
            "score_scale": "5/10",
            "headlines": []
        }

    result = sentiment_model(headlines)
    score_map = {"positive": 1, "neutral": 0, "negative": -1}

    # Calculate average sentiment in [-1, 1]
    raw_score = sum(score_map[r["label"].lower()] for r in result) / len(result)

    # Scale to [0, 10]
    scaled_score = round(((raw_score + 1) / 2) * 10, 2)

    if scaled_score >= 7:
        sentiment = "positive"
    elif scaled_score <= 3:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {
        "sentiment": sentiment,
        "score": scaled_score,
        "score_scale": f"{scaled_score}/10",
        "headlines": headlines
    }
