import { BeakerIcon, SparklesIcon } from "lucide-react";

export default function ChannelsPage() {
  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 rounded-lg p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <BeakerIcon className="h-20 w-20 text-blue-500 animate-pulse" />
            <SparklesIcon className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Under Development
        </h2>
        <p className="mb-6 text-gray-300">
          We&apos;re working hard to build this amazing experience for you.
          Please check back later to explore new features!
        </p>
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Return to Home
        </button>
      </div>
    </div>
  );
}
