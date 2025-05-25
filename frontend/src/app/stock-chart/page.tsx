'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface StockDataPoint {
  CH_TIMESTAMP: string;
  CH_CLOSING_PRICE: number;
}

export default function StockChartPage() {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stocks?symbol=TCS')
      .then(res => res.json())
      .then((result) => {
        const chartData = result[0].data.map((point: any) => ({
          CH_TIMESTAMP: point.CH_TIMESTAMP,
          CH_CLOSING_PRICE: point.CH_CLOSING_PRICE,
        }));
        setData(chartData.reverse()); // So the latest date is on the right
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading chart...</p>;

  return (
    <div className="w-full h-[500px] p-6">
      <h2 className="text-2xl font-bold mb-4">TCS Stock Closing Prices (Last 6 Months)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="CH_TIMESTAMP" tick={{ fontSize: 12 }} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="CH_CLOSING_PRICE" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
