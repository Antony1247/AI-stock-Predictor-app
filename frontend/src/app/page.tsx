import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Stock App</title>
        <meta name="description" content="Predict the Indian stock market with AI insights." />
      </Head>
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📈 AI Stock Predictor</h1>
          <p className="text-lg text-gray-600 mb-6">
            Get real-time predictions and investment suggestions for the Indian stock market.
          </p>
    <Link href="/sentiment">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition">
        Get Started
      </button>
    </Link>
        </div>
      </main>
    </>
  );
}
