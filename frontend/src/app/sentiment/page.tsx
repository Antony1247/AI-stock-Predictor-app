"use client";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SentimentPage() {
  const [symbol, setSymbol] = useState("");
  type SentimentData = {
    sentiment: string;
    score_scale: number;
    headlines: string[];
    headline_scores?: number[]; // Optional: per-headline scores
  };

  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSentiment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8002/sentiment/${symbol}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching sentiment", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get color based on sentiment score
  const getPointColor = (score: number) => {
    if (score > 0) return "rgba(34,197,94,0.8)"; // green for positive
    if (score < 0) return "rgba(239,68,68,0.8)"; // red for negative
    return "rgba(156,163,175,0.8)"; // gray for neutral
  };

  // Use per-headline scores if available, else fallback to overall sentiment
  const chartData = {
    labels: data?.headlines
      ? data.headlines.map((_, idx) => (idx + 1).toString())
      : [],
    datasets: [
      {
        label: "Sentiment Score per Headline",
        data: data?.headline_scores
          ? data.headline_scores
          : data?.headlines?.map(() =>
              data.sentiment === "positive" ? 1 : data.sentiment === "negative" ? -1 : 0
            ),
        borderColor: "#36A2EB",
        backgroundColor: data?.headline_scores
          ? data.headline_scores.map(getPointColor)
          : data?.headlines?.map(() =>
              data.sentiment === "positive"
                ? "rgba(34,197,94,0.8)"
                : data.sentiment === "negative"
                ? "rgba(239,68,68,0.8)"
                : "rgba(156,163,175,0.8)"
            ),
        pointBackgroundColor: data?.headline_scores
          ? data.headline_scores.map(getPointColor)
          : undefined,
        pointRadius: 6,
        fill: false,
        tension: 0.2,
      },
      // Add horizontal line at y=1
      {
        label: "Positive Threshold (1)",
        data: data?.headlines ? data.headlines.map(() => 1) : [],
        borderColor: "rgba(34,197,94,0.5)",
        borderDash: [8, 4],
        pointRadius: 0,
        fill: false,
        type: "line" as const,
      },
      // Add horizontal line at y=-1
      {
        label: "Negative Threshold (-1)",
        data: data?.headlines ? data.headlines.map(() => -1) : [],
        borderColor: "rgba(239,68,68,0.5)",
        borderDash: [8, 4],
        pointRadius: 0,
        fill: false,
        type: "line" as const,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (ctx: import("chart.js").TooltipItem<"line">[]) =>
            data?.headlines[ctx[0].dataIndex] || `News #${ctx[0].dataIndex + 1}`,
          label: (ctx: import("chart.js").TooltipItem<"line">) => `Score: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        min: -10,
        max: 10,
        title: { display: true, text: "Sentiment Score" },
        ticks: {
          stepSize: 2,
          callback: (tickValue: string | number) => tickValue,
        },
      },
      x: {
        title: { display: true, text: "News Item Number" },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Stock Sentiment Checker</h1>
      <input
        className="border px-3 py-2 rounded mr-2"
        placeholder="Enter stock symbol (e.g. TCS)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={fetchSentiment}
        disabled={loading}
      >
        {loading ? "Loading..." : "Analyze"}
      </button>

      {data && (
        <div className="mt-6">
          <p className="text-lg font-medium">
            Sentiment: <span className="font-bold">{data.sentiment}</span>
          </p>
          <p className="mb-4">Score: {data.score_scale}</p>

          <Line data={chartData} options={chartOptions} />

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Headlines:</h2>
            <ul className="list-disc pl-5">
              {data.headlines.map((headline, idx) => (
                <li key={idx}>
                  {headline}
                  {data.headline_scores && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Score: {data.headline_scores[idx]})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
