// frontend/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">AI Stock App</div>
        <div className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-gray-800">Home</Link>
          <a href="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</a>
        </div>
      </div>
    </nav>
  );
}
