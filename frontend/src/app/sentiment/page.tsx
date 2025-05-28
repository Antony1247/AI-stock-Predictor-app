'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface StockDataPoint {
  CH_TIMESTAMP: string;
  CH_CLOSING_PRICE: number;
}

export default function StockInsightPage() {
  const [company, setCompany] = useState('');
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async () => {
    setLoadingChart(true);
    setError(null);
    setSentiment(null);
    setData([]);

    try {
      const res = await fetch(`/api/stocks?symbol=${company}`);
      const result = await res.json();

      if (!result || !result[0]?.data) throw new Error("Invalid API response");

      const chartData = result[0].data.map((point: StockDataPoint) => ({
        CH_TIMESTAMP: point.CH_TIMESTAMP,
        CH_CLOSING_PRICE: point.CH_CLOSING_PRICE,
      }));

      setData(chartData.reverse());
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch stock data');
      } else {
        setError('Failed to fetch stock data');
      }
    } finally {
      setLoadingChart(false);
    }
  };

  const handleAnalyze = async () => {
    setLoadingAI(true);
    setError(null);
    setSentiment(null);

    try {
      await fetch('http://localhost:8002/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      });

      const fileRes = await fetch(`http://localhost:8002/get-report`);
      if (!fileRes.ok) throw new Error(await fileRes.text());

      const fileContent = await fileRes.text();
      setSentiment(fileContent);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'AI analysis failed.');
      } else {
        setError('AI analysis failed.');
      }
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📊 Stock Insight & Sentiment Analyzer
      </h1>

      {/* Input */}
      <div className="flex flex-col sm:flex-row items-center gap-3 max-w-3xl mx-auto mb-8">
        <input
          className="border border-gray-700 bg-gray-900 text-white rounded px-4 py-2 w-full"
          placeholder="Enter Company Symbol (e.g. TCS, INFY, TITAN)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button
          onClick={fetchChartData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loadingChart || !company}
        >
          {loadingChart ? 'Loading...' : 'Submit'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      {/* Stock Chart */}
      {data.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 mb-6 max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">{company.toUpperCase()} Stock Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="CH_TIMESTAMP" tick={{ fontSize: 12, fill: '#ccc' }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#ccc' }} />
              <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
              <Line
                type="monotone"
                dataKey="CH_CLOSING_PRICE"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="text-center mt-6">
            <button
              onClick={handleAnalyze}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
              disabled={loadingAI}
            >
              {loadingAI ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>
        </div>
      )}

      {/* AI Output */}
      {sentiment && (
        <div className="prose prose-invert max-w-5xl mx-auto bg-gray-900 text-white p-6 rounded-lg shadow">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {sentiment}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
