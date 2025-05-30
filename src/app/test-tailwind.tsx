'use client';

export default function TestTailwind() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Tailwind Test</h1>
      <p className="text-gray-700 mb-4">This is a test component with direct Tailwind classes.</p>
      <div className="bg-red-500 text-white p-4 rounded-md shadow-md hover:bg-red-600 transition-colors">
        This box should be red with white text
      </div>
      <div className="mt-4 bg-green-500 text-white p-4 rounded-md shadow-md hover:bg-green-600 transition-colors">
        This box should be green with white text
      </div>
      <div className="mt-4 bg-blue-500 text-white p-4 rounded-md shadow-md hover:bg-blue-600 transition-colors">
        This box should be blue with white text
      </div>
      <button className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
        Test Button
      </button>
    </div>
  );
}
