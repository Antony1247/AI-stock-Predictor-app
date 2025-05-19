import feedparser

def get_headlines(symbol: str):
    query = symbol.split(".")[0] + "+stock"
    feed_url = f"https://news.google.com/rss/search?q={query}"

    feed = feedparser.parse(feed_url)
    headlines = [entry.title for entry in feed.entries[:30]]
    return headlines
