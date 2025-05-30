AI Stock Predictor App
======================

An AI-powered stock prediction platform that helps investors make smarter decisions using agentic AI workflows and powerful local LLMs. Built with **Next.js**, **Ollama** for running local models, and **Agno** to orchestrate intelligent multi-agent interactions.

  ![CleanShot 2025-05-30 at 19 19 26@2x](https://github.com/user-attachments/assets/0a0f0c78-90bd-4ca8-99dd-3b86a7862d9f)

🚀 Features
-----------

*   🔮 **Stock Investment Prediction**: Analyze and predict potential stock performance based on historical data and news sentiment.
    
*   🧠 **Agentic AI**: Uses [Agno](https://www.npmjs.com/package/agno) to coordinate intelligent agents that specialize in data gathering, sentiment analysis, and decision making.
    
*   🖥️ **Local LLM Inference**: Integrated with [Ollama](https://ollama.com/) to run large language models directly on your machine — no API keys or cloud costs.
    
*   ⚙️ **Modular Architecture**: Designed with microservice principles. Each AI agent (data, sentiment, prediction, portfolio) runs independently and communicates efficiently.
    
*   🌐 **Next.js Frontend**: A clean, responsive interface to input stock tickers, view analysis, and track prediction results.
    

🏗️ Tech Stack
--------------

*   **Frontend**: [Next.js](https://nextjs.org/)
    
*   **Backend Agents**: FastAPI (Python)
    
*   **Agent Framework**: [Agno](https://www.npmjs.com/package/agno)
    
*   **LLM Runtime**: [Ollama](https://ollama.com/) (supports models like DeepSeek, LLaMA, Mistral)
    
*   **Docker**: For containerized, reproducible dev environments
    
*   **VS Code Dev Containers**: Pre-configured for seamless development
    

🧪 How It Works
---------------

1.  **User Input**: Enter a stock ticker on the frontend.
    
2.  **Data Agent**: Fetches live and historical data (via stock-nse-india NPM or APIs).
    
3.  **Sentiment Agent**: Uses LLM via Ollama to analyze financial news and assign sentiment scores.
    
4.  **Prediction Agent**: Combines sentiment and technical indicators to forecast potential trends.
    
5.  **Portfolio Agent**: Suggests investment actions based on user goals and predictions.
    

⚙️ Getting Started
------------------

### Prerequisites

*   [Docker](https://www.docker.com/)
    
*   [Ollama](https://ollama.com/) installed locally and running a supported model
    
*   [Node.js](https://nodejs.org/) (for frontend dev)
    

### 1\. Clone the Repo

```bash
git clone https://github.com/Antony1247/AI-stock-Predictor-app.git
cd AI-stock-Predictor-app
```

### 2\. Start Ollama

```bash
ollama run deepseek # or another model like mistral
```

### 3\. Start the App (Dev Containers)

```bash
Use VS Code and reopen in container (recommended):
```

# In VS Code  > Remote-Containers: Reopen in Container   `

Or manually:

```bash
docker-compose up --build
```

🧠 Supported Models
-------------------

Tested with the following models via Ollama:

*   deepseek
    
*   llama3
    
*   mistral
    
*   gemma
    

> You can swap models by changing your Ollama config and restarting the agents.

📊 Sample Use Case
------------------

```Text
Predict performance of TCS next week  → Data Agent fetches historical prices & news  → Sentiment Agent scores news: +6 (positive outlook)  → Prediction Agent: Bullish trend expected (+3%)  → Portfolio Agent: Suggests partial buy   `
```
🛠️ Roadmap
-----------

*    Add chart visualizations of predictions
    
*    Implement user authentication & watchlists
    
*    Improve agent coordination using Agno pipelines
    
*    Extend support to BSE, crypto, global stocks

✨ Credits
---------

*   [Ollama](https://ollama.com/)
    
*   [Agno](https://www.npmjs.com/package/agno)

*   DeepSeek-R1
    
*   NSE India Stock APIs

  

🧑‍💻 App Screenshots
-------------------
![CleanShot 2025-05-28 at 18 32 24@2x](https://github.com/user-attachments/assets/8e993cb6-4bbf-4a20-bf17-a23d6402e5d7)
![CleanShot 2025-05-28 at 18 32 51@2x](https://github.com/user-attachments/assets/07cbe4ad-fcba-4f3a-9622-0ea3e31401f6)


📄 License
----------

MIT License
