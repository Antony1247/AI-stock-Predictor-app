'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function SentimentPage() {
  const [company, setCompany] = useState('Titan')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('http://localhost:8002/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company }),
      })

      const data = await res.json()

      if (!res.ok || !data.report) {
        throw new Error(data.message || 'Failed to get report.')
      }

      setResult(data.report)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">📊 Investment Sentiment Analyzer</h1>

      <div className="flex items-center gap-2 mb-4">
        <input
          className="border rounded px-4 py-2 w-full"
          placeholder="Enter Company Name (e.g. Titan, Infosys, TCS)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

{result && (
<div className="prose max-w-none bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded shadow-lg">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
  </div>
)}
    </div>
  )
}
