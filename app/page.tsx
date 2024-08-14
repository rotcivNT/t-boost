import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-semibold text-gray-100">
                TBoost
              </span>
            </div>
            <div className="flex items-center">
              <Link
                href="/sign-in"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">
              TBoost
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Better Communication. Efficient Collaboration.
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
              ChatApp helps teams work together more effectively, connecting
              people no matter where they are.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Get Started for Free
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Everything you need to work efficiently
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  title: "Real-time Messaging",
                  description:
                    "Communicate quickly and easily with colleagues.",
                },
                {
                  title: "Topic Channels",
                  description:
                    "Organize conversations by project, team, or topic.",
                },
                {
                  title: "File Sharing",
                  description: "Easily share and collaborate on documents.",
                },
                {
                  title: "Integrations",
                  description:
                    "Connect with the tools and services you use daily.",
                },
              ].map((feature) => (
                <div key={feature.title} className="relative">
                  <dt>
                    <p className="ml-16 text-lg leading-6 font-medium text-white">
                      {feature.title}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-400">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
