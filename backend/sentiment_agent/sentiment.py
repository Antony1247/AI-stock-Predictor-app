from transformers import pipeline

sentiment_model = pipeline("sentiment-analysis", model="ProsusAI/finbert")

def analyze_sentiment(headlines):
    if not headlines:
        return {
            "sentiment": "neutral",
            "score": 5.0,
            "score_scale": "5/10",
            "headlines": [],
            "headline_scores": []
        }

    results = sentiment_model(headlines)
    
    headline_scores = []
    for result in results:
        label = result["label"].lower()
        confidence = result["score"]
        
        # Convert each headline to 1-10 scale
        if label == "positive":
            # Positive: 6-10 based on confidence (0.5-1.0 → 6-10)
            score = 6 + (confidence - 0.5) * 8  # Maps 0.5→6, 1.0→10
        elif label == "negative":
            # Negative: 1-5 based on confidence (0.5-1.0 → 1-5)
            score = 5 - (confidence - 0.5) * 8  # Maps 0.5→5, 1.0→1
        else:  # neutral
            # Neutral: 4-6 based on confidence
            score = 5 + (confidence - 0.5) * 2  # Maps 0.5→5, 1.0→6
        
        # Ensure score stays within 1-10 bounds
        score = max(1, min(10, round(score, 2)))
        headline_scores.append(score)

    # Calculate overall average
    avg_score = round(sum(headline_scores) / len(headline_scores), 2)
    
    # Determine overall sentiment
    if avg_score >= 7:
        sentiment = "positive"
    elif avg_score <= 3:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {
        "sentiment": sentiment,
        "score": avg_score,
        "score_scale": f"{avg_score}/10",
        "headlines": headlines,
        "headline_scores": headline_scores
    }