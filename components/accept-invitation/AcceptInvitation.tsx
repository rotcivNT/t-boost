import Link from "next/link";

interface IProps {
  data: any;
}
function AcceptInvitation({ data }: IProps) {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200 animate-fade-in">
      <div className="p-6 flex items-start space-x-4">
        <div className="flex-shrink-0">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            Join Channel Successfully
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You have successfully joined the channel. You can now start chatting
            with other members.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcceptInvitation;
