import os
import feedparser
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import ollama
import re

from agno.agent import Agent, RunResponse  # noqa
from agno.models.ollama import Ollama
from agno.storage.sqlite import SqliteStorage
from agno.tools.yfinance import YFinanceTools
from agno.utils.log import logger
from agno.utils.pprint import pprint_run_response
from ollama import Client as OllamaClient
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.workflow import Workflow

from textwrap import dedent
from pathlib import Path
from shutil import rmtree
from typing import Iterator

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


reports_dir = Path(__file__).parent.joinpath("reports", "investment")
if reports_dir.is_dir():
    rmtree(path=reports_dir, ignore_errors=True)
reports_dir.mkdir(parents=True, exist_ok=True)
stock_analyst_report = str(reports_dir.joinpath("stock_analyst_report.md"))
# research_analyst_report = str(reports_dir.joinpath("research_analyst_report.md"))
# investment_report = str(reports_dir.joinpath("investment_report.md"))

class SentimentRequest(BaseModel):
    company: str


class InvestmentReportGenerator(Workflow):
    description: str = dedent("""\
        An intelligent investment analysis system that produces comprehensive financial research and
        strategic investment recommendations. This workflow orchestrates multiple AI agents to analyze
        market data, evaluate investment potential, and create detailed portfolio allocation strategies.
        The system excels at combining quantitative analysis with qualitative insights to deliver
        actionable investment advice.
        """)

    stock_analyst = Agent(
        name="stock_Analyst",
        model=Ollama(id="llama3.2", client=OllamaClient()),
        tools=[YFinanceTools(company_info=True, analyst_recommendations=True, company_news=True),DuckDuckGoTools()],
        description = dedent("""\
            You are MarketMaster-X, a top-tier Senior Investment Analyst at Goldman Sachs with deep expertise in:

            - Comprehensive market analysis
            - Financial statement evaluation
            - Industry trend identification
            - News impact assessment
            - Risk factor analysis
            - Growth potential evaluation

            Your job is to evaluate companies for investment potential, combining both quantitative financial data and qualitative sentiment signals from recent news.
            """),
        instructions = dedent("""\
            📈 1. Market Research
            - Analyze company fundamentals and metrics
            - Review recent stock price performance
            - Evaluate competitive position and market share
            - Assess sector trends and macroeconomic context

            💹 2. Financial Analysis
            - Review financial statements and key ratios (e.g., P/E, EPS, ROE, debt/equity)
            - Interpret analyst recommendations (e.g., Strong Buy, Hold, Sell)
            - Identify drivers of revenue and profit growth
            - Highlight growth catalysts (new products, markets, partnerships)

            📰 3. News Sentiment Analysis
            - Review news articles and headlines from the last 6 months
            - Classify headlines as **Good News**, **Bad News**, or **Neutral**
            - If needed, call `DuckDuckGoTools()` to get updated or more relevant headlines
            - Assess overall sentiment tone and impact on the company’s future outlook

            🎯 4. Risk Assessment
            - Identify internal risks (e.g., management issues, litigation, debt load)
            - Identify external risks (e.g., regulation, competition, economic downturns)
            - Discuss possible red flags or uncertainties

            🧮 Final Output Format:
            Sentiment Score: <score from -10 to +10>
            Investment Report:
            <2–3 paragraphs combining key findings from steps 1–4>

            Good News:
            - <positive headline>
            - ...

            Bad News:
            - <negative headline>
            - ...

            Neutral/Unclear News (optional):
            - <headline>

            Final Justification:
            <Explain why you gave this score – highlight the most influential factors>

            ✅ Scoring Guide:
            +10 = Extremely Bullish 🚀
            +5 to +9 = Bullish 📈
            0 to +4 = Cautiously Optimistic 🙂
            -1 to -4 = Cautiously Bearish 😐
            -5 to -9 = Bearish 📉
            -10 = Extremely Bearish 🔻\
            """),
        expected_output="Comprehensive market analysis report in markdown format",
        markdown=True,
        save_response_to_file=stock_analyst_report,
    )

    def generate_report(self, companies: str) -> Iterator[RunResponse]:
        logger.info(f"Getting investment reports for companies: {companies}")
        initial_report: RunResponse = self.stock_analyst.run(companies)
        if initial_report is None or not initial_report.content:
            yield RunResponse(
                run_id=self.run_id,
                content="Sorry, could not get the stock analyst report.",
            )
            return
        yield initial_report


# Print the response in the terminal
# stock_analyst.print_response("talk about tcs stock news")


@app.post("/analyze")
def analyze_sentiment(req: SentimentRequest):
    workflow = InvestmentReportGenerator(
        session_id=f"session_{req.company.lower().replace(' ', '_')}",
        storage=SqliteStorage(
            table_name="investment_report_workflows",
            db_file="tmp/agno_workflows.db",
        ),
    )
    result = next(workflow.generate_report(req.company))
    return {
        "report": result.content,
        "status": "success",
    }
