import yfinance as yf

def fetch_stock_data(symbol: str):
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period="6mo")
    hist.reset_index(inplace=True)
    return hist.tail(60).to_dict(orient="records")
