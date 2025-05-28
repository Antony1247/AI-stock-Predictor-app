'use client';

import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Agno AI – Intelligent Indian Stock Insights</title>
        <meta name="description" content="Discover AI-powered insights for Indian stocks using Agno. Get sentiment analysis, price trends, and actionable investment advice." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-6 py-12 flex items-center justify-center">
        <div className="max-w-5xl w-full space-y-12">

          {/* Header */}
          <section className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-4">
              📈 Welcome to <span className="text-purple-400">Srock Predictor</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              An AI-powered platform delivering <span className="text-indigo-400 font-medium">real-time stock market predictions</span>, 
              sentiment analysis from news, and AI-generated investment insights — all in one place.
            </p>
          </section>

          {/* Features */}
          <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-300 mb-6">🔍 What Can Agno AI Do?</h2>
            <ul className="space-y-4 text-gray-300 text-lg list-disc list-inside">
              <li>
                📊 <span className="text-white font-medium">Real-Time Price Prediction:</span> View trend lines and data-driven price estimates using historical and technical indicators.
              </li>
              <li>
                🗞️ <span className="text-white font-medium">AI Sentiment Analysis:</span> Parses market news and financial articles to deliver bullish or bearish ratings.
              </li>
              <li>
                🧠 <span className="text-white font-medium">Company Fundamentals:</span> Understand each stock’s business model, financials, and market presence.
              </li>
              <li>
                ⚙️ <span className="text-white font-medium">Agentic Architecture:</span> Our multi-agent system includes data scrapers, prediction agents, and portfolio advisors.
              </li>
              <li>
                🔔 <span className="text-white font-medium">Investor Intelligence:</span> Designed for retail traders, analysts, and students exploring smart investing.
              </li>
            </ul>
          </section>

          {/* CTAs */}
          <section className="flex flex-col sm:flex-row justify-center gap-6 text-center">
            <Link href="/sentiment">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 shadow-lg">
                Get Started
              </button>
            </Link>
          </section>

          {/* About Section */}
          <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-green-300 mb-4">💡 About This App</h2>
            <p className="text-gray-300 text-lg">
              This app was built using cutting-edge technologies including <span className="font-semibold text-white">Next.js</span>, <span className="font-semibold text-white">FastAPI</span>, and <span className="font-semibold text-white">llama</span> model. The system is containerized using Docker and designed with developer tools like GitHub Actions and Terraform.
              <br /><br />
              It’s more than just a tool — it’s your <span className="text-purple-400 font-semibold">AI co-pilot</span> for the Indian stock market.
            </p>
          </section>

        </div>
      </main>
    </>
  );
}
