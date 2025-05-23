# # news_sentiment_agent.py

# import feedparser
# from agno.agent import Agent
# from ollama_model import OllamaModel

# def get_headlines(symbol: str) -> list[str]:
#     query = symbol.split(".")[0] + "+stock"
#     feed_url = f"https://news.google.com/rss/search?q={query}"
#     feed = feedparser.parse(feed_url)
#     return [entry.title for entry in feed.entries[:30]]

# def create_agent() -> Agent:
#     return Agent(
#         model=OllamaModel("deepseek"),  # Replace with "llama3" or other if needed
#         instructions=[
#             "You are a financial sentiment analysis assistant.",
#             "Given a list of headlines about a company, return a single float number between -1 and 1 indicating sentiment.",
#             "Do not explain. Do not format. Only return the float number.",
#         ],
#         markdown=False
#     )

# def analyze_sentiment(agent: Agent, company: str, headlines: list[str]) -> float:
#     news_text = "\n".join(f"- {headline}" for headline in headlines)
#     prompt = f"""
# Company: {company}
# Headlines:
# {news_text}

# Return a single float score between -1 (negative) and 1 (positive).
# Only return the float. No explanation.
# """
#     response = agent.model.complete(prompt)
#     try:
#         return float(response.strip())
#     except ValueError:
#         return None

# if __name__ == "__main__":
#     symbol = "TATAMOTORS.NS"
#     company = "Tata Motors"
    
#     headlines = get_headlines(symbol)
#     agent = create_agent()
#     score = analyze_sentiment(agent, company, headlines)

#     print(score)
